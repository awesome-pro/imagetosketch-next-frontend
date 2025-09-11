'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoginInput, UserStatus } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, PencilIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { GoogleOAuthButton } from '@/components/auth/google-oauth-button';
import Image from 'next/image';

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});


export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const loginData: LoginInput = {
        email: values.email,
        password: values.password,
      };
      
      const { user } = await signIn(loginData);
      
      if (user && user.status === UserStatus.ACTIVE) {
        toast.loading('Redirecting to dashboard...', {
          duration: 2000,
          id: 'redirect'
        })
        setTimeout(() => {
          window.location.href = '/app';
          toast.dismiss('redirect');
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message || 'User creation failed. Please try again.');
    }
  };

  return (
    <section className="h-screen w-screen flex items-center justify-center bg-slate-200 dark:bg-gradient-to-br from-slate-700 to-slate-900">
       <div className="absolute top-5 left-5 flex items-center gap-2 text-black dark:text-white">
          <ArrowLeft size={20} />
          <Link href="/">
            Back to Home
          </Link>
      </div>
        <Card className="shadow-2xl rounded-2xl border-0 w-[90%] md:w-[500px] mx-auto px-4 py-8 flex flex-col items-center justify-center">
        
            <Link href="/" className="text-2xl font-semibold font-serif text-primary flex items-center gap-2 mb-4">
              Sketchify<PencilIcon className='w-6 h-6' />
            </Link>

       
        <GoogleOAuthButton 
              mode="signin" 
              disabled={isLoading || isSubmitting}
              onSuccess={() => {
                setIsSubmitting(true)
                toast.success('Successfully signed in with Google!')
              }}
              onError={(error) => {
                toast.error(error)
                setIsSubmitting(false)
              }}
            />
           
        </Card>
  </section>
  );
}