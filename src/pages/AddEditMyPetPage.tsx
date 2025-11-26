// --- FIXED FRONTEND FOR PET CREATION (COMPATIBLE WITH BACKEND) ---

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/api/axios-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, X, Loader2 } from "lucide-react";

const petSchema = z.object({
  name: z.string().min(2),
  breed: z.string().min(2),
  age: z.string().min(1),
  gender: z.string().min(1),
  price: z.string().min(1, { message: "Price is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  medical_history: z.string().optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

const AddEditMyPetPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      breed: "",
      age: "",
      gender: "",
      price: "",
      description: "",
      medical_history: ""
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isEditMode) fetchPet();
  }, [isAuthenticated]);

  const fetchPet = async () => {
    try {
      setFetching(true);
      const res = await axiosClient.get(`/pets/${id}`);

      if (!res.data.success) throw new Error("Failed to fetch pet");

      const pet = res.data.data.pet;

      form.reset({
        name: pet.name,
        breed: pet.breed,
        age: String(pet.age),
        gender: pet.gender,
        price: pet.price ? String(pet.price) : "",
        description: pet.description || "",
        medical_history: pet.medical_history || ""
      });

      if (Array.isArray(pet.image_urls)) {
        setExistingImages(pet.image_urls);
      }

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load pet",
        variant: "destructive"
      });
      navigate("/my-pets");
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...imageFiles, ...files].slice(0, 5);

    setImageFiles(newFiles);

    const previews: string[] = [];
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === newFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PetFormValues) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("breed", data.breed);
      formData.append("age", String(Number(data.age)));  // MUST BE NUMBER
      formData.append("gender", data.gender);
      formData.append("price", String(Number(data.price)));  // MUST BE NUMBER
      formData.append("description", data.description);

      if (data.medical_history) {
        formData.append("medical_history", data.medical_history);
      }

      // --- IMPORTANT ---
      // Backend expects `req.files` for create
      if (!isEditMode) {
        imageFiles.forEach((file) => formData.append("images", file));
      }

      let response;

      if (isEditMode) {
        // No image update supported in backend update route unless they coded it
        response = await axiosClient.put(`/pets/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        response = await axiosClient.post("/pets", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      if (!response.data?.success) {
        throw new Error(response.data.message || "Failed to save pet");
      }

      toast({
        title: isEditMode ? "Pet Updated" : "Pet Added",
        description: response.data.message
      });

      setTimeout(() => navigate("/my-pets"), 1000);

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Edit Pet" : "Add New Pet"}</CardTitle>
            <CardDescription>
              {isEditMode ? "Update your pet" : "Add your new pet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* NAME */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BREED + AGE */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* GENDER */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PRICE */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="e.g., 5000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DESCRIPTION */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[100px]" placeholder="Describe your pet..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MEDICAL HISTORY */}
                <FormField
                  control={form.control}
                  name="medical_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical History (Optional)</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[100px]" placeholder="Medical history or additional notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* IMAGES FOR CREATE ONLY */}
                {!isEditMode && (
                  <div>
                    <FormLabel>Pet Images (up to 5)</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />

                    {/* PREVIEWS */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {imagePreviews.map((src, i) => (
                          <div key={i} className="relative group">
                            <img src={src} className="w-full h-32 object-cover rounded" />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                            >
                              <X />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : isEditMode ? "Update Pet" : "Add Pet"}
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddEditMyPetPage;
