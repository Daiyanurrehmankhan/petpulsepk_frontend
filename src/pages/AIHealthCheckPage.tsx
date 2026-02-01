import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Upload, Camera, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import pythonAi, { PredictionResponse } from "@/lib/api/pythonAi";

const AIHealthCheckPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              if (!f) return;
                              setSelectedFile(f);
                              setSelectedImage(URL.createObjectURL(f));
                              setResult(null);
                              setError(null);
                            }}
                          />
                          <Button variant="hero" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
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
              {selectedImage && (
                <div className="mt-4 flex items-center gap-3">
                  <Button
                    onClick={async () => {
                      if (!selectedFile) return;
                      setLoading(true);
                      setError(null);
                      setResult(null);
                      try {
                        const res = await pythonAi.predict(selectedFile);
                        setResult(res);
                      } catch (err: any) {
                        setError(err?.response?.data?.message || err.message || 'Prediction failed');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Image'}
                  </Button>

                  <Button variant="outline" onClick={() => {
                    setSelectedFile(null);
                    setSelectedImage(null);
                    setResult(null);
                    setError(null);
                  }}>
                    Remove
                  </Button>
                </div>
              )}
            </Card>

            {/* Analysis Results */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
              
              <div className="space-y-6">
                {loading && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground animate-pulse" />
                    </div>
                    <p className="text-muted-foreground">Analyzing image, please wait...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-8">
                    <div className="text-red-600 font-semibold mb-3">Error</div>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                )}

                {result && (
                  <div className="py-4">
                    <h3 className="text-lg font-semibold text-center mb-4">Prediction</h3>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold">{result.disease}</div>
                      <div className="text-sm text-muted-foreground">Confidence: {result.confidencePercent ?? (result.confidence ? `${(result.confidence * 100).toFixed(2)}%` : 'N/A')}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{result.isConfident ? 'High confidence' : 'Low confidence'}</div>
                    </div>

                    {result.allProbabilities && (
                      <div>
                        <h4 className="font-medium mb-2">Probabilities</h4>
                        <div className="space-y-2">
                          {Object.entries(result.allProbabilities).map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm">
                              <div className="text-muted-foreground">{k}</div>
                              <div className="font-medium">{(v * 100).toFixed(2)}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!loading && !error && !result && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Upload an image to start analysis</p>
                  </div>
                )}
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
