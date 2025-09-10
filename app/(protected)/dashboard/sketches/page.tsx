"use client";

import React, { useEffect, useState } from 'react';
import { useSketch } from "@/hooks/use-sketch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Image as ImageIcon, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Trash2,
  RefreshCw,
  Grid,
  List
} from 'lucide-react';
import { Sketch, SketchStatus } from "@/types/sketch";
import { toast } from "sonner";
import Image from 'next/image';

export default function GalleryPage() {
  const { sketches, loadSketches, deleteSketch, isLoading } = useSketch();
  const [filteredSketches, setFilteredSketches] = useState<Sketch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SketchStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSketch, setSelectedSketch] = useState<Sketch | null>(null);

  useEffect(() => {
    loadSketches();
  }, [loadSketches]);

  useEffect(() => {
    let filtered = sketches;
    if (searchTerm) {
      filtered = filtered.filter(sketch => 
        sketch.id.toString().includes(searchTerm) ||
        sketch.style.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(sketch => sketch.status === statusFilter);
    }

    setFilteredSketches(filtered);
  }, [sketches, searchTerm, statusFilter]);

  const handleDownload = async (sketch: Sketch) => {
    try {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = sketch.sketch_image_url
      link.download = `sketch-${sketch.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started!");
    } catch (error) {
      toast.error("Failed to download sketch");
      console.error('Download error:', error);
    }
  };

  const handleDelete = async (sketch: Sketch) => {
    if (window.confirm("Are you sure you want to delete this sketch?")) {
      try {
        await deleteSketch(sketch.id);
        toast.success("Sketch deleted successfully");
      } catch (error) {
        toast.error("Failed to delete sketch");
      }
    }
  };

  const getStatusColor = (status: SketchStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredSketches.map((sketch) => (
        <Card key={sketch.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            {
              sketch.sketch_image_url && (
                <Image
                  src={sketch.sketch_image_url}
                  alt={`Sketch image of ${sketch.id}`}
                  width={600}
                  height={800}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              )
            }
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Sketch #{sketch.id}</h3>
              <Badge className={`text-xs ${getStatusColor(sketch.status)}`}>
                {sketch.status}
              </Badge>
            </div>
            
            <div className="space-y-1 mb-3">
              <p className="text-xs text-gray-500">Style: {sketch.style}</p>
              <p className="text-xs text-gray-500">Type: {sketch.type}</p>
              {/* <p className="text-xs text-gray-500">{formatDate(sketch.created_at.toISOString())}</p> */}
            </div>
            
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedSketch(sketch)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Sketch #{selectedSketch?.id}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Image 
                      src={selectedSketch?.original_image_url || ""}
                      alt={`Sketch of ${selectedSketch?.id}`}
                      width={600}
                      height={800}
                      className="w-full h-auto rounded-lg shadow-2xl"
                    />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Style:</strong> {selectedSketch?.style}
                      </div>
                      <div>
                        <strong>Type:</strong> {selectedSketch?.type}
                      </div>
                      <div>
                        <strong>Status:</strong> {selectedSketch?.status}
                      </div>
                      <div>
                        {/* <strong>Created:</strong> {selectedSketch && formatDate(selectedSketch.created_at.toISOString())} */}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {sketch.status === 'completed' && (
                <Button 
                  size="sm" 
                  onClick={() => handleDownload(sketch)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(sketch)}
              className="w-full mt-2"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {filteredSketches.map((sketch) => (
        <Card key={sketch.id}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
               {
                sketch.sketch_image_url && (
                  <Image
                    src={sketch.sketch_image_url}
                    alt={`Sketch image of ${sketch.id}`}
                    width={600}
                    height={800}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                )
               }
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Sketch #{sketch.id}</h3>
                  <Badge className={`text-xs ${getStatusColor(sketch.status)}`}>
                    {sketch.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>Style: {sketch.style}</div>
                  <div>Type: {sketch.type}</div>
                  {/* <div>{formatDate(sketch.created_at.toISOString())}</div> */}
                </div>
              </div>
              
              <div className="flex space-x-2 flex-shrink-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedSketch(sketch)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
                
                {sketch.status === 'completed' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleDownload(sketch)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(sketch)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your sketches
          </p>
        </div>
        
        <Button onClick={loadSketches} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search sketches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredSketches.length} of {sketches.length} sketches
          </p>
        </div>

        {filteredSketches.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sketches found</h3>
                <p className="text-gray-600">
                  {sketches.length === 0 
                    ? "You haven't created any sketches yet. Go to the dashboard to get started!"
                    : "No sketches match your current filters. Try adjusting your search criteria."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          viewMode === "grid" ? <GridView /> : <ListView />
        )}
      </div>
    </div>
  );
}
