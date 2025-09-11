"use client";

import React, { useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell,
  Trash2,
  Download,
  Info
} from 'lucide-react';
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your sketches."
    );
    
    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'To confirm account deletion, please type "DELETE" (in capital letters):'
    );
    
    if (doubleConfirm !== "DELETE") {
      toast.error("Account deletion cancelled");
      return;
    }

    setIsDeleting(true);
    try {
      // TODO: Implement account deletion API call
      toast.error("Account deletion is not yet implemented");
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    try {
      // TODO: Implement data export
      toast.info("Data export feature coming soon");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <SettingsIcon className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Account Role</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="capitalize">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Account Status</label>
                  <div className="mt-1">
                    <Badge 
                      variant={user?.status === 'active' ? 'default' : 'destructive'}
                      className="capitalize"
                    >
                      {user?.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {/* {user?.created_at ? formatDate(user.created_at) : 'N/A'} */}
                  </p>
                </div>
              </div>

              <Separator />

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Profile editing is currently not available. Contact support if you need to update your information.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-600">Last updated: Not available</p>
                  </div>
                  <Button variant="outline" disabled>
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" disabled>
                    Enable 2FA
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="text-sm text-gray-600">Manage your active sessions</p>
                  </div>
                  <Button variant="outline" disabled>
                    View Sessions
                  </Button>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Advanced security features are coming soon. Your account is secured with industry-standard encryption.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates about your sketches</p>
                  </div>
                  <Button variant="outline" disabled>
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Processing Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified when sketches are ready</p>
                  </div>
                  <Button variant="outline" disabled>
                    Configure
                  </Button>
                </div>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Notification preferences will be available in a future update.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleExportData}
                variant="outline" 
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              
              <Button 
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out successfully");
                }}
                variant="outline" 
                className="w-full justify-start"
              >
                <User className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">Danger Zone</h4>
                <Button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  variant="destructive" 
                  className="w-full justify-start"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sketches</span>
                <Badge variant="secondary">0</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <Badge variant="default">0</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Processing</span>
                <Badge variant="secondary">0</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Failed</span>
                <Badge variant="destructive">0</Badge>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Storage Used</span>
                <Badge variant="outline">N/A</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Need help? Check out our resources or contact support.
              </p>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled>
                  Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
