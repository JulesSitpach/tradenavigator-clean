import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../hooks/use-toast';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, navigate] = useLocation();
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      industry: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully. Welcome to TradeNavigator!",
      });
      navigate('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was an error creating your account. This email might already be in use.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-primary">TradeNavigator</h1>
        <h2 className="mt-6 text-2xl font-bold text-center">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md px-3 py-2"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md px-3 py-2"
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md px-3 py-2"
                  {...form.register('confirmPassword')}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium">
                Company Name
              </label>
              <div className="mt-1">
                <input
                  id="companyName"
                  type="text"
                  autoComplete="organization"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md px-3 py-2"
                  {...form.register('companyName')}
                />
                {form.formState.errors.companyName && (
                  <p className="mt-1 text-sm text-destructive">{form.formState.errors.companyName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium">
                Industry (Optional)
              </label>
              <div className="mt-1">
                <select
                  id="industry"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md px-3 py-2"
                  {...form.register('industry')}
                >
                  <option value="">Select an industry</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="technology">Technology</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
                {form.formState.errors.industry && (
                  <p className="mt-1 text-sm text-destructive">{form.formState.errors.industry.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm">
                I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

