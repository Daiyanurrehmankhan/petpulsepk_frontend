import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axiosClient from '@/lib/api/axios-client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload } from "lucide-react";

const addPetSchema = z.object({
  name: z.string().min(2, { message: "Pet name must be at least 2 characters" }),
  species: z.string().min(1, { message: "Species is required" }),
  breed: z.string().min(2, { message: "Breed must be at least 2 characters" }),
  ageYears: z.string().min(1, { message: "Age (years) is required" }),
  ageMonths: z.string().min(1, { message: "Age (months) is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  healthStatus: z.string().min(1, { message: "Health status is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  features: z.string().min(5, { message: "Features are required (comma-separated)" }),
  image: z.any().refine((files) => files?.length > 0, "Image is required"),
});

type AddPetFormValues = z.infer<typeof addPetSchema>;

const AddPetPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<AddPetFormValues>({
    resolver: zodResolver(addPetSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      ageYears: "",
      ageMonths: "",
      gender: "",
      healthStatus: "",
      price: "",
      location: "",
      description: "",
      features: "",
    },
  });

  useEffect(() => {
    // rely on AuthContext for auth state
    if (isAuthenticated) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      toast({
        title: "Authentication Required",
        description: "Please log in to add a pet listing",
        variant: "destructive",
      });
      setTimeout(() => navigate("/login"), 1200);
    }
  }, [isAuthenticated, navigate, toast]);

  const onSubmit = async (data: AddPetFormValues) => {
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('breed', data.breed);
      // send age in years as integer (backend expects integer)
      fd.append('age', String(parseInt(data.ageYears || '0')));
      fd.append('gender', data.gender);
      // map description to medical_history column
      fd.append('medical_history', data.description || '');

      // append image file if present
      const fileList = (data as any).image as FileList | undefined;
      if (fileList && fileList.length > 0) {
        fd.append('image', fileList[0]);
      }

      // send to backend - create pet
      const res = await axiosClient.post('/pets', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Failed to add pet');
      }

      // Pet created successfully
      const pet = res.data.data?.pet;

      // Create a marketplace listing for the newly created pet so it appears on the marketplace
      const numericPrice = parseFloat((data.price || '').toString().replace(/[^0-9.]/g, '')) || 0;
      const title = `${pet.name}${pet.breed ? ` - ${pet.breed}` : ''}`;
      const listingPayload = {
        pet_id: pet.id,
        price: numericPrice,
        title,
        description: data.description || pet.description || '',
      };

      try {
        const listingRes = await axiosClient.post('/marketplace/listings', listingPayload);
        if (!listingRes.data?.success) {
          // Listing creation failed, but pet exists. Notify user.
          toast({
            title: 'Pet created',
            description: 'Pet added but failed to publish listing. You can publish it from your dashboard.',
            variant: 'destructive',
          });
          return;
        }
      } catch (err) {
        console.warn('Failed to create marketplace listing', err);
        toast({
          title: 'Pet created',
          description: 'Pet added but failed to publish listing. You can publish it from your dashboard.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Pet Added Successfully!',
        description: res.data.message || 'Your pet listing has been created.',
      });
      setTimeout(() => navigate('/marketplace'), 1200);
    } catch (err: any) {
      toast({
        title: 'Failed to add pet',
        description: err.response?.data?.message || err.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Add Pet Listing</CardTitle>
            <CardDescription>
              Fill in the details to create a new pet listing on our marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Luna" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Species</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select species" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cat">Cat</SelectItem>
                            <SelectItem value="dog">Dog</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Persian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ageYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (Years)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select years" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...Array(16)].map((_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i} {i === 1 ? 'year' : 'years'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ageMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (Months)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select months" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...Array(12)].map((_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i} {i === 1 ? 'month' : 'months'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                  <FormField
                    control={form.control}
                    name="healthStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select health status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="needs-attention">Needs Attention</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., $450" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., New York, NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your pet..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Vaccinated, Health Certificate, Microchipped" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Pet Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                onChange(e.target.files);
                                handleImageChange(e);
                              }}
                              {...field}
                              className="cursor-pointer"
                            />
                            <Upload className="w-5 h-5 text-muted-foreground" />
                          </div>
                          {imagePreview && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                              <img
                                src={imagePreview}
                                alt="Pet preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Add Pet Listing
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/marketplace")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddPetPage;
