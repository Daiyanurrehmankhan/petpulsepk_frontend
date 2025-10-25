import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const addPetSchema = z.object({
  name: z.string().min(2, { message: "Pet name must be at least 2 characters" }),
  breed: z.string().min(2, { message: "Breed must be at least 2 characters" }),
  age: z.string().min(1, { message: "Age is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  features: z.string().min(5, { message: "Features are required (comma-separated)" }),
});

type AddPetFormValues = z.infer<typeof addPetSchema>;

const AddPetPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const form = useForm<AddPetFormValues>({
    resolver: zodResolver(addPetSchema),
    defaultValues: {
      name: "",
      breed: "",
      age: "",
      price: "",
      location: "",
      description: "",
      features: "",
    },
  });

  useEffect(() => {
    // Check if user is logged in (you'll need to implement your actual auth check)
    // For now, checking localStorage as a placeholder
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      if (!user) {
        setIsLoggedIn(false);
        toast({
          title: "Authentication Required",
          description: "Please log in to add a pet listing",
          variant: "destructive",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setIsLoggedIn(true);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const onSubmit = (data: AddPetFormValues) => {
    console.log("Pet data:", data);
    toast({
      title: "Pet Added Successfully!",
      description: "Your pet listing has been created.",
    });
    // Here you would typically send the data to your backend
    setTimeout(() => navigate("/marketplace"), 1500);
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
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Persian Cat" {...field} />
                        </FormControl>
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
                          <Input placeholder="e.g., 8 months" {...field} />
                        </FormControl>
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
