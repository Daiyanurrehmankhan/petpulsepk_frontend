import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/api/axios-client";
import { useState } from "react";

// Step 1: Request Reset Code
const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

// Step 2: Reset Password with Code
const resetSchema = z.object({
  resetCode: z.string().length(6, { message: "Reset code must be 6 digits" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/auth/forgot-password", data);
      const { responseData } = response;

      if (response.status === 200) {
        setUserEmail(data.email);
        setStep('reset');
        toast({
          title: "Code Sent",
          description: "A password reset code has been sent to your email. Please check your inbox.",
          variant: "default",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send reset code";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/auth/reset-password", {
        resetCode: data.resetCode,
        newPassword: data.newPassword,
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Your password has been reset successfully. Redirecting to login...",
          variant: "default",
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to reset password";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <Navigation />
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          {step === 'email' ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">🔐 Reset Password</CardTitle>
                <CardDescription className="text-center">
                  Enter your email to receive a reset code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your email" 
                              type="email" 
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      variant="hero" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Code"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">🔑 Enter Reset Code</CardTitle>
                <CardDescription className="text-center">
                  We sent a code to<br /><strong>{userEmail}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4" autoComplete="off">
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      className="hidden"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <input
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      className="hidden"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <FormField
                      control={resetForm.control}
                      name="resetCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter 6-digit code" 
                              type="text"
                              name="verificationCode"
                              inputMode="numeric"
                              autoComplete="new-password"
                              autoCapitalize="off"
                              autoCorrect="off"
                              spellCheck={false}
                              pattern="[0-9]*"
                              maxLength={6}
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="At least 6 characters" 
                              type="password"
                              autoComplete="new-password"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Confirm your password" 
                              type="password"
                              autoComplete="new-password"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      variant="hero" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  variant="ghost"
                  className="w-full text-primary"
                  onClick={() => {
                    setStep('email');
                    emailForm.reset();
                    resetForm.reset();
                  }}
                >
                  ← Back to Email Entry
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
