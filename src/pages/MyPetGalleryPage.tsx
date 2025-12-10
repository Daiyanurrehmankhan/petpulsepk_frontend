import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/api/axios-client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Upload, Trash2, Edit2, ChevronLeft, ChevronRight, X, PawPrint, Loader2, Image as ImageIcon } from "lucide-react";

interface Picture {
  id: string;
  pet_id: string;
  image_url: string;
  caption?: string;
  created_at: string;
}

interface Pet {
  id: string;
  name: string;
  breed: string;
}

const MyPetGalleryPage = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [pet, setPet] = useState<Pet | null>(null);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Upload dialog state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Edit caption dialog
  const [editCaptionDialogOpen, setEditCaptionDialogOpen] = useState(false);
  const [editingPictureId, setEditingPictureId] = useState<string | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [editingCaption, setEditingCaption] = useState(false);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPictureId, setDeletingPictureId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (petId) {
      fetchPetAndPictures();
    }
  }, [petId, isAuthenticated, navigate]);

  const fetchPetAndPictures = async () => {
    try {
      setLoading(true);
      
      // Fetch pet details
      const petResponse = await axiosClient.get(`/pets/${petId}`);
      if (petResponse.data?.success) {
        setPet(petResponse.data.data?.pet);
      } else {
        toast({
          title: "Error",
          description: "Failed to load pet details",
          variant: "destructive",
        });
        navigate("/my-pets");
        return;
      }

      // Fetch pictures
      const picturesResponse = await axiosClient.get(`/pets/${petId}/pictures`);
      if (picturesResponse.data?.success) {
        setPictures(picturesResponse.data.data?.pictures || []);
      } else {
        setPictures([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch pet or pictures:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load pet gallery",
        variant: "destructive",
      });
      navigate("/my-pets");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (uploadMethod === "file" && !selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (uploadMethod === "url" && !imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();

      if (uploadMethod === "file") {
        formData.append("image", selectedFile!);
      } else {
        formData.append("image_url", imageUrl);
      }

      if (caption.trim()) {
        formData.append("caption", caption);
      }

      const response = await axiosClient.post(`/pets/${petId}/pictures`, formData, {
        headers: {
          "Content-Type": uploadMethod === "file" ? "multipart/form-data" : "application/json",
        },
      });

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Picture added successfully",
        });

        // Reset form
        setSelectedFile(null);
        setImageUrl("");
        setCaption("");
        setUploadMethod("file");
        setUploadDialogOpen(false);

        // Refresh pictures
        await fetchPetAndPictures();
      } else {
        throw new Error(response.data?.message || "Failed to upload picture");
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditCaption = async () => {
    if (!editingPictureId) return;

    try {
      setEditingCaption(true);
      const response = await axiosClient.put(
        `/pets/${petId}/pictures/${editingPictureId}`,
        { caption: newCaption || null }
      );

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Caption updated successfully",
        });

        setPictures(
          pictures.map((pic) =>
            pic.id === editingPictureId ? { ...pic, caption: newCaption || undefined } : pic
          )
        );

        setEditCaptionDialogOpen(false);
        setEditingPictureId(null);
        setNewCaption("");
      } else {
        throw new Error(response.data?.message || "Failed to update caption");
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update caption",
        variant: "destructive",
      });
    } finally {
      setEditingCaption(false);
    }
  };

  const handleDeleteClick = (pictureId: string) => {
    setDeletingPictureId(pictureId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingPictureId) return;

    try {
      setDeleting(true);
      const response = await axiosClient.delete(`/pets/${petId}/pictures/${deletingPictureId}`);

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Picture deleted successfully",
        });

        setPictures(pictures.filter((pic) => pic.id !== deletingPictureId));
        setDeleteDialogOpen(false);
        setDeletingPictureId(null);

        // Adjust lightbox index if needed
        if (lightboxOpen && lightboxIndex >= pictures.length - 1) {
          setLightboxIndex(Math.max(0, lightboxIndex - 1));
        }
      } else {
        throw new Error(response.data?.message || "Failed to delete picture");
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete picture",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    const baseURL = import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, "") || "";
    return baseURL + imageUrl;
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % pictures.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + pictures.length) % pictures.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-muted-foreground">Pet not found</p>
          <Button onClick={() => navigate("/my-pets")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Pets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button and Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/my-pets")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Pets
          </Button>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {pet.name}'s Photo Gallery
              </h1>
              <p className="text-muted-foreground">{pet.breed}</p>
            </div>
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Add Picture
            </Button>
          </div>
        </div>

        {/* Pictures Grid or Empty State */}
        {pictures.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No pictures added yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by uploading your first photo of {pet.name}. You can add multiple pictures
              and add captions to describe each one.
            </p>
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Your First Picture
            </Button>
          </Card>
        ) : (
          <>
            {/* Pictures Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {pictures.map((picture, index) => (
                <div
                  key={picture.id}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={getImageUrl(picture.image_url) || ""}
                    alt={picture.caption || "Pet picture"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-background/80 hover:bg-background text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPictureId(picture.id);
                        setNewCaption(picture.caption || "");
                        setEditCaptionDialogOpen(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-background/80 hover:bg-background text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(picture.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Caption Badge */}
                  {picture.caption && (
                    <Badge className="absolute bottom-2 left-2 bg-background/80 text-foreground max-w-[calc(100%-1rem)] truncate">
                      {picture.caption}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Picture to Gallery</DialogTitle>
            <DialogDescription>
              Upload a photo of {pet?.name} to their gallery. You can add a caption too!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload Method Tabs */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={uploadMethod === "file" ? "default" : "outline"}
                onClick={() => setUploadMethod("file")}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <Button
                variant={uploadMethod === "url" ? "default" : "outline"}
                onClick={() => setUploadMethod("url")}
                className="flex-1"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Image URL
              </Button>
            </div>

            {/* File Upload */}
            {uploadMethod === "file" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            )}

            {/* URL Upload */}
            {uploadMethod === "url" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={uploading}
                />
              </div>
            )}

            {/* Caption */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Caption (Optional)</label>
              <Textarea
                placeholder="Add a caption for this picture..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={uploading}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Caption Dialog */}
      <Dialog open={editCaptionDialogOpen} onOpenChange={setEditCaptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Caption</DialogTitle>
            <DialogDescription>
              Update the caption for this picture
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Add a caption for this picture..."
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            rows={4}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditCaptionDialogOpen(false)}
              disabled={editingCaption}
            >
              Cancel
            </Button>
            <Button onClick={handleEditCaption} disabled={editingCaption}>
              {editingCaption ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Picture</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this picture? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal */}
      {lightboxOpen && pictures.length > 0 && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-4xl p-0 border-0 bg-black/90">
            <div className="relative aspect-square md:aspect-video max-h-[80vh] flex items-center justify-center">
              <img
                src={getImageUrl(pictures[lightboxIndex].image_url) || ""}
                alt={pictures[lightboxIndex].caption || "Pet picture"}
                className="w-full h-full object-contain"
              />

              {/* Close Button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation */}
              {pictures.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Image Counter and Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                {pictures[lightboxIndex].caption && (
                  <p className="text-lg mb-2">{pictures[lightboxIndex].caption}</p>
                )}
                <p className="text-sm text-gray-300">
                  {lightboxIndex + 1} / {pictures.length}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyPetGalleryPage;
