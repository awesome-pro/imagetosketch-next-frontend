'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { RegisterInput, UserRole, UserStatus } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { FaGoogle } from 'react-icons/fa';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});


export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const registerData: RegisterInput = {
        email: values.email,
        password: values.password,
      };
      
      const user = await signUp(registerData);
      
      if (user && user.status === UserStatus.ACTIVE) {
        toast.success('User created successfully!');
        toast.loading('Redirecting to dashboard...', {
          duration: 2000,
          id: 'redirect'
        })
        setTimeout(() => {
          window.location.href = '/dashboard';
          toast.dismiss('redirect');
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message || 'User creation failed. Please try again.');
    }
  };

  return (
    <section className="h-screen w-screen flex items-center justify-center bg-slate-200 dark:bg-gradient-to-br from-slate-700 to-slate-900">
        <Card className="shadow-2xl rounded-2xl border-0   px-4 py-8 md:min-w-[500px]">
        <CardContent className="pt-4 ">

        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input placeholder="********" className='w-full' type={showPassword ? 'text' : 'password'} {...field} />
                      <Button variant="ghost" type='button' size="icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password*</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input placeholder="********" className='w-full' type={showPassword ? 'text' : 'password'} {...field} />
                      <Button variant="ghost" type='button' size="icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            
              <Button 
                type="submit" 
                disabled={isLoading}
                className='w-full'
                size={'lg'}
                >
                {isLoading ? 'Please wait...' : 'Create Account'}
                </Button>
          </form>
        </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <p className='text-center text-sm text-muted-foreground'> Already have an account? <Link href="/auth/sign-in" className="text-primary">Sign In</Link></p>
        </CardFooter>
        <p className='text-center text-sm text-muted-foreground'>--OR--</p>
        <Button variant='outline' size='lg' className='w-full'>
          Continue with <FaGoogle />
        </Button>
        </Card>
  </section>
  );
}