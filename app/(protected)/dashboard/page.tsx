"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useUpload } from "@/hooks/use-upload";
import { useSketch } from "@/hooks/use-sketch";
import { FileUpload } from "@/components/upload/file-upload";
import { SketchConfig } from "@/components/sketch/sketch-config";
import { ProcessingStatus } from "@/components/sketch/processing-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Clock,
  CheckCircle,
  AlertCircle} from 'lucide-react';
import { SketchStyle, SketchType } from "@/types/sketch";
import { websocketService } from "@/services";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useAuth();
  const { uploadFile, isUploading, progress, error: uploadError, reset: resetUpload } = useUpload();
  const { 
    createSketch, 
    loadSketches, 
    sketches, 
    isCreating, 
    processingTasks,
    error: sketchError 
  } = useSketch();

  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  // Initialize WebSocket connection and load sketches
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Connect to WebSocket for real-time updates
        if (user) {
          // We'll need to get the JWT token from cookies or auth context
          // For now, we'll skip WebSocket connection as it requires token extraction
          // await websocketService.connect(userToken);
        }
        
        // Load existing sketches
        await loadSketches();
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initializeServices();

    return () => {
      websocketService.disconnect();
    };
  }, [user, loadSketches]);

  const handleFileSelect = (file: File) => {
    resetUpload();
    setUploadedFileKey(null);
  };

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadFile(file);
      setUploadedFileKey(result.key);
      setActiveTab("configure");
      toast.success("File uploaded successfully! Now configure your sketch.");
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleCreateSketch = async (config: {
    style: SketchStyle;
    type: SketchType;
    method: 'basic' | 'advanced' | 'artistic';
  }) => {
    if (!uploadedFileKey) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      await createSketch({
        input_key: uploadedFileKey,
        style: config.style,
        sketch_type: config.type,
        method: config.method,
      });
      
      setActiveTab("status");
      toast.success("Sketch processing started!");
    } catch (error) {
      console.error('Failed to create sketch:', error);
    }
  };

  const getStatsCards = () => {
    const totalSketches = sketches.length;
    const completedSketches = sketches.filter(s => s.status === 'completed').length;
    const processingSketches = sketches.filter(s => s.status === 'processing').length;
    const failedSketches = sketches.filter(s => s.status === 'failed').length;

    return [
      {
        title: "Total Sketches",
        value: totalSketches,
        icon: ImageIcon,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Completed",
        value: completedSketches,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Processing",
        value: processingSketches,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      },
      {
        title: "Failed",
        value: failedSketches,
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
    ];
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.email}! Transform your images into beautiful sketches.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {user?.role}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsCards().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
    <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload and Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </TabsTrigger>
              <TabsTrigger value="configure" disabled={!uploadedFileKey}>
                <Palette className="w-4 h-4 mr-2" />
                Configure
              </TabsTrigger>
              <TabsTrigger value="status">
                <Clock className="w-4 h-4 mr-2" />
                Status
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Image</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    onUpload={handleUpload}
                    isUploading={isUploading}
                    progress={progress}
                    error={uploadError}
                  />
                  
                  {uploadedFileKey && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Image uploaded successfully!
                        </span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        You can now configure your sketch settings.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configure" className="mt-6">
              <SketchConfig
                onCreateSketch={handleCreateSketch}
                disabled={!uploadedFileKey}
                isCreating={isCreating}
              />
            </TabsContent>

            <TabsContent value="status" className="mt-6">
              <ProcessingStatus
                tasks={processingTasks}
                onView={(taskId) => {
                  // Handle view sketch
                  console.log('View sketch for task:', taskId);
                }}
                onDownload={(taskId) => {
                  // Handle download sketch
                  console.log('Download sketch for task:', taskId);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Recent Sketches */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Sketches</span>
                <Button variant="outline" size="sm" onClick={loadSketches}>
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sketches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No sketches yet</p>
                  <p className="text-sm">Upload an image to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sketches.slice(0, 5).map((sketch) => (
                    <div key={sketch.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium truncate">
                          Sketch #{sketch.id}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={
                              sketch.status === 'completed' ? 'default' :
                              sketch.status === 'processing' ? 'secondary' :
                              sketch.status === 'failed' ? 'destructive' : 'outline'
                            }
                            className="text-xs"
                          >
                            {sketch.status}
                          </Badge>
                          <span className="text-xs text-gray-500 capitalize">
                            {sketch.style}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
