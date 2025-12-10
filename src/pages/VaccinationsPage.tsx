import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import * as vaccinationsApi from '@/lib/api/vaccinations';
import { Loader2, Upload, X, ArrowLeft, Plus, Syringe, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const VaccinationsPage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: vaccinations = [], isLoading } = useQuery({
    queryKey: ['vaccinations', petId],
    queryFn: () => (petId ? vaccinationsApi.getVaccinations(petId) : Promise.resolve([])),
    enabled: !!petId,
  });

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => vaccinationsApi.createVaccination(fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations', petId] });
      setShowForm(false);
      setSelectedFile(null);
      // Reset form inputs
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) form.reset();
      toast({
        title: 'Success',
        description: 'Vaccination record created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create vaccination',
        variant: 'destructive',
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => vaccinationsApi.verifyVaccination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations', petId] });
      toast({
        title: 'Success',
        description: 'Vaccination verified successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to verify vaccination',
        variant: 'destructive',
      });
    },
  });

  const unverifyMutation = useMutation({
    mutationFn: (id: string) => vaccinationsApi.unverifyVaccination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations', petId] });
      toast({
        title: 'Success',
        description: 'Vaccination unverified successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to unverify vaccination',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!petId) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('pet_id', petId);
    createMutation.mutate(fd);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    const fileInput = document.querySelector('input[name="certificate"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <Link to="/pet-portal" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Pets
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Pet Vaccinations
              </h1>
              <p className="text-gray-600">Manage and track your pet's vaccination records</p>
            </div>
            <Button 
              onClick={() => setShowForm((s) => !s)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              {showForm ? 'Cancel' : 'Add Vaccination'}
            </Button>
          </div>
        </div>

        {/* Add Vaccination Form */}
        {showForm && (
          <Card className="mb-8 p-8 border-0 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Syringe className="w-6 h-6 text-blue-600" />
              Add New Vaccination Record
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Vaccine Name *</label>
                  <input 
                    name="vaccine_name" 
                    required 
                    placeholder="e.g., Rabies, DHPP" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Vaccine Type</label>
                  <input 
                    name="vaccine_type" 
                    placeholder="e.g., Core vaccine, Non-core" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Administered Date *</label>
                  <input 
                    name="administered_date" 
                    type="date" 
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Next Due Date</label>
                  <input 
                    name="next_due_date" 
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Veterinarian Name</label>
                  <input 
                    name="vet_name" 
                    placeholder="Dr. Name" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Batch Number</label>
                  <input 
                    name="batch_number" 
                    placeholder="Vaccine batch #" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Notes</label>
                <textarea 
                  name="notes" 
                  placeholder="Any additional notes about this vaccination..." 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                  rows={4} 
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Certificate</label>
                {selectedFile ? (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFile}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group">
                    <input 
                      type="file" 
                      name="certificate" 
                      accept=".jpg,.jpeg,.png,.pdf,image/*" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3 group-hover:text-blue-600" />
                    <p className="font-medium text-gray-700">Upload certificate</p>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG, or PDF (max 5MB)</p>
                  </div>
                )}
              </div>
              
              {user?.role === 'vet' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="verify_now" 
                      name="verify_now" 
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer" 
                    />
                    <label htmlFor="verify_now" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Auto-verify this vaccination (Vet only)
                    </label>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  size="lg"
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Vaccination Record
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Vaccinations List */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading vaccinations...</p>
              </div>
            </div>
          ) : vaccinations.length === 0 ? (
            <Card className="p-12 text-center border-0 shadow-lg">
              <Syringe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No vaccinations yet</h3>
              <p className="text-gray-500 mb-6">Start tracking your pet's vaccination records by adding the first one.</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              >
                <Plus className="w-4 h-4" />
                Add First Vaccination
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {vaccinations.map((v) => (
                <Card key={v.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-lg">
                          <Syringe className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{v.vaccine_name}</h3>
                          {v.vaccine_type && (
                            <p className="text-sm text-gray-600 mt-1">{v.vaccine_type}</p>
                          )}
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1 ${
                        v.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {v.verified ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Verified
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            Unverified
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Administered</p>
                          <p className="text-gray-900 font-medium">{new Date(v.administered_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      
                      {v.next_due_date && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Next Due</p>
                            <p className="text-gray-900 font-medium">{new Date(v.next_due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                      )}
                      
                      {v.vet_name && (
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5">👨‍⚕️</div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Veterinarian</p>
                            <p className="text-gray-900 font-medium">{v.vet_name}</p>
                          </div>
                        </div>
                      )}
                      
                      {v.batch_number && (
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Batch Number</p>
                            <p className="text-gray-900 font-medium">{v.batch_number}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {v.notes && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</p>
                        <p className="text-gray-700">{v.notes}</p>
                      </div>
                    )}
                    
                    {v.evidence_url && (
                      <a 
                        href={v.evidence_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        View Certificate
                      </a>
                    )}
                  </div>
                  
                  {user?.role === 'vet' && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
                      {!v.verified ? (
                        <Button 
                          onClick={() => verifyMutation.mutate(v.id)} 
                          disabled={verifyMutation.isPending}
                          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {verifyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                          <CheckCircle className="w-4 h-4" />
                          Verify Vaccination
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => unverifyMutation.mutate(v.id)} 
                          disabled={unverifyMutation.isPending}
                          variant="destructive"
                          className="gap-2"
                        >
                          {unverifyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                          Unverify
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationsPage;
