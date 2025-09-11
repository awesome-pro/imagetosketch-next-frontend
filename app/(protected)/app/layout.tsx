"use client";

import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useEffect } from 'react'
import { UserStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { TopBar } from '@/components/layout/topbar';
import { LoaderIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <FileUploadProvider> */}
          <SidebarProvider
            style={{
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
          >
              {children}
          </SidebarProvider>
        {/* </FileUploadProvider> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// Component to display status-specific alerts with actions
function StatusAlert({ status, onAction }: { status: UserStatus, onAction: () => void }) {

  return (
    <Alert variant="destructive" className="max-w-md mx-auto mt-8">
      <AlertDescription className="mt-2">
        <Button onClick={onAction} variant="destructive">
          Test
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  // Handle user status redirects
  useEffect(() => {
    if (user && user.status !== UserStatus.ACTIVE) {
      const redirectMap = {
        [UserStatus.SUSPENDED]: '/suspended',
        [UserStatus.INACTIVE]: '/inactive',
        [UserStatus.VERIFICATION_PENDING]: '/verification-pending'
      };
      
      const redirectPath = redirectMap[user.status];
      if (redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [user, router]);

  // Show loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <LoaderIcon className="h-6 w-6 animate-spin mb-4 text-primary" />
        <h6>
           You are so beautiful 🥰, so cute 😍. Can you please wait a few seconds?
        </h6>
      </div>
    );
  }

  // Handle unauthenticated users
  if (!user) {
    window.location.href = '/auth/sign-in';
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <LoaderIcon className="h-6 w-6 animate-spin mb-4 text-primary" />
      </div>  
    );
  }

  // Handle non-active users with status alerts
  if (user.status !== UserStatus.ACTIVE) {
    const handleStatusAction = () => {
      const redirectMap = {
        [UserStatus.ACTIVE]: '/dashboard',
        [UserStatus.SUSPENDED]: '/suspended',
        [UserStatus.INACTIVE]: '/inactive',
        [UserStatus.VERIFICATION_PENDING]: '/verification-pending'
      };
      
      const redirectPath = redirectMap[user.status];
      if (redirectPath) {
        router.push(redirectPath);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <StatusAlert status={user.status} onAction={handleStatusAction} />
      </div>
    );
  }

  // Only active users can access protected content
  return (
    <Providers>
      <AppSidebar variant="inset" />
      <main className="w-full">
        <TopBar />
        <div className="h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </Providers>
  );
}

export default DashboardLayout