import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Camera, Search, Plus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import lostAndFoundApi, { IdentifyPetResponse, RegisterPetResponse } from "@/lib/api/lostAndFound";
import { useToast } from "@/hooks/use-toast";

// Zod Schemas
const registerSchema = z.object({
  petId: z.string().min(1, { message: "Pet ID is required" }).min(3, { message: "Pet ID must be at least 3 characters" }),
});

const identifySchema = z.object({
  // Only image, no form fields needed
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type IdentifyFormValues = z.infer<typeof identifySchema>;

const PetsLostAndFoundPage = () => {
  const { toast } = useToast();
  const registerFileInputRef = useRef<HTMLInputElement | null>(null);
  const identifyFileInputRef = useRef<HTMLInputElement | null>(null);

  // Register states
  const [registerSelectedImage, setRegisterSelectedImage] = useState<string | null>(null);
  const [registerSelectedFile, setRegisterSelectedFile] = useState<File | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerResult, setRegisterResult] = useState<RegisterPetResponse | null>(null);

  // Identify states
  const [identifySelectedImage, setIdentifySelectedImage] = useState<string | null>(null);
  const [identifySelectedFile, setIdentifySelectedFile] = useState<File | null>(null);
  const [identifyLoading, setIdentifyLoading] = useState(false);
  const [identifyResult, setIdentifyResult] = useState<IdentifyPetResponse | null>(null);

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      petId: "",
    },
  });

  // Identify form
  const identifyForm = useForm<IdentifyFormValues>({
    resolver: zodResolver(identifySchema),
  });

  // Handle register submit
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    if (!registerSelectedFile) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    setRegisterLoading(true);
    const result = await lostAndFoundApi.registerPet(registerSelectedFile, data.petId);

    if (result.success) {
      setRegisterResult(result);
      toast({
        title: "Success",
        description: `Pet "${data.petId}" registered as ${result.data.type}`,
        variant: "default",
      });
      registerForm.reset();
      setRegisterSelectedImage(null);
      setRegisterSelectedFile(null);
    } else {
      toast({
        title: "Registration Failed",
        description: result.error || "Failed to register pet",
        variant: "destructive",
      });
      setRegisterResult(null);
    }

    setRegisterLoading(false);
  };

  // Handle identify submit
  const onIdentifySubmit = async () => {
    if (!identifySelectedFile) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    setIdentifyLoading(true);
    const result = await lostAndFoundApi.identifyPet(identifySelectedFile);

    if (result.success) {
      setIdentifyResult(result);

      if (result.data.status === "match_found") {
        toast({
          title: "🎉 Pet Found!",
          description: `Matched: ${result.data.matchedPetId} (${result.data.petType})`,
          variant: "default",
        });
      } else {
        toast({
          title: "No Match Found",
          description: `No matching ${result.data.petType} in the system`,
          variant: "default",
        });
      }
    } else {
      toast({
        title: "Identification Failed",
        description: result.error || "Failed to identify pet",
        variant: "destructive",
      });
      setIdentifyResult(null);
    }

    setIdentifyLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Search className="w-4 h-4 mr-2" />
              Lost & Found Module
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pet <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Lost & Found</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Register your pet's biometric data to help find lost pets using AI-powered recognition
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Register Pet Section */}
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <CardTitle>Register Pet</CardTitle>
                </div>
                <CardDescription>
                  Register your pet with biometric data for Lost & Found tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Pet Photo *</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    {registerSelectedImage ? (
                      <div className="space-y-4">
                        <img
                          src={registerSelectedImage}
                          alt="Selected pet"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setRegisterSelectedImage(null);
                            setRegisterSelectedFile(null);
                            setRegisterResult(null);
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Drop image or click to browse</p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Clear, front-facing photo (JPEG, PNG, WebP)
                          </p>
                          <div className="flex gap-2 justify-center flex-wrap">
                            <input
                              ref={registerFileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0] || null;
                                if (!f) return;
                                setRegisterSelectedFile(f);
                                setRegisterSelectedImage(URL.createObjectURL(f));
                                setRegisterResult(null);
                              }}
                            />
                            <Button
                              type="button"
                              variant="hero"
                              size="sm"
                              onClick={() => registerFileInputRef.current?.click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form */}
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="petId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet ID (Unique Identifier) *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., fluffy_001, dog_2025"
                              disabled={registerLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerLoading || !registerSelectedFile}
                    >
                      {registerLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Register Pet
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Register Result */}
                {registerResult && (
                  <div className="mt-6 p-4 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">Registration Successful</h4>
                        <p className="text-sm text-green-800 mb-2">
                          Pet <strong>{registerResult.data.petId}</strong> registered as{" "}
                          <strong>{registerResult.data.type}</strong>
                        </p>
                        <p className="text-xs text-green-700">{registerResult.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Identify Pet Section */}
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-5 h-5 text-primary" />
                  <CardTitle>Identify Pet</CardTitle>
                </div>
                <CardDescription>
                  Upload a pet photo to identify it from registered database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Pet Photo to Identify *</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    {identifySelectedImage ? (
                      <div className="space-y-4">
                        <img
                          src={identifySelectedImage}
                          alt="Selected pet"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIdentifySelectedImage(null);
                            setIdentifySelectedFile(null);
                            setIdentifyResult(null);
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Search className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Drop image or click to browse</p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Clear photo of the pet (JPEG, PNG, WebP)
                          </p>
                          <div className="flex gap-2 justify-center flex-wrap">
                            <input
                              ref={identifyFileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0] || null;
                                if (!f) return;
                                setIdentifySelectedFile(f);
                                setIdentifySelectedImage(URL.createObjectURL(f));
                                setIdentifyResult(null);
                              }}
                            />
                            <Button
                              type="button"
                              variant="hero"
                              size="sm"
                              onClick={() => identifyFileInputRef.current?.click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Identify Button */}
                <Button
                  onClick={onIdentifySubmit}
                  className="w-full"
                  disabled={identifyLoading || !identifySelectedFile}
                >
                  {identifyLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Identifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Identify Pet
                    </>
                  )}
                </Button>

                {/* Identify Result - Match Found */}
                {identifyResult && identifyResult.data.status === "match_found" && (
                  <div className="mt-6 p-4 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-green-900 mb-3">🎉 Pet Found!</h4>
                        <div className="space-y-2 text-sm text-green-800">
                          <p>
                            <strong>Pet ID:</strong> {identifyResult.data.matchedPetId}
                          </p>
                          <p>
                            <strong>Type:</strong> {identifyResult.data.petType}
                          </p>
                          <p>
                            <strong>Confidence:</strong>{" "}
                            {identifyResult.data.confidenceDistance
                              ? ((1 - identifyResult.data.confidenceDistance) * 100).toFixed(1)
                              : "N/A"}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="w-full">
                      Contact Owner
                    </Button>
                  </div>
                )}

                {/* Identify Result - No Match */}
                {identifyResult && identifyResult.data.status === "no_match" && (
                  <div className="mt-6 p-4 rounded-lg border border-amber-200 bg-amber-50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-900 mb-1">No Match Found</h4>
                        <p className="text-sm text-amber-800">
                          This {identifyResult.data.petType} is not registered in the system
                        </p>
                        <p className="text-xs text-amber-700 mt-2">{identifyResult.data.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetsLostAndFoundPage;
