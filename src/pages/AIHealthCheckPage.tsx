import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Upload, Camera, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

const AIHealthCheckPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Diagnostics
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pet Health <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Diagnostics</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a photo of your pet's skin condition and get instant AI-powered analysis with veterinary-grade accuracy
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Upload Section */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Upload Pet Photo</h2>
              
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center mb-6 hover:border-primary transition-colors">
                {selectedImage ? (
                  <div className="space-y-4">
                    <img src={selectedImage} alt="Selected pet" className="max-h-64 mx-auto rounded-lg" />
                    <Button variant="outline" onClick={() => setSelectedImage(null)}>
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium mb-2">Drop your image here</p>
                      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                      <div className="flex gap-4 justify-center">
                        <Button variant="hero">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                        <Button variant="outline">
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Supported formats:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-muted rounded-full text-xs">JPG</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs">PNG</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs">HEIC</span>
                </div>
              </div>
            </Card>

            {/* Analysis Results */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
              
              <div className="space-y-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Upload an image to start analysis</p>
                </div>
              </div>
            </Card>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">1. Upload Photo</h3>
                <p className="text-sm text-muted-foreground">Take or upload a clear photo of the affected area</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">2. AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Our AI analyzes the image using advanced computer vision</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">3. Get Results</h3>
                <p className="text-sm text-muted-foreground">Receive instant diagnosis and confidence score</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">4. Next Steps</h3>
                <p className="text-sm text-muted-foreground">Get treatment recommendations and vet consultation options</p>
              </Card>
            </div>
          </div>

          {/* Disclaimer */}
          <Card className="p-6 bg-muted/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Medical Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  This AI diagnostic tool is designed to assist in identifying potential pet skin conditions. 
                  Results should not replace professional veterinary consultation. Always consult with a licensed 
                  veterinarian for accurate diagnosis and treatment plans.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AIHealthCheckPage;
