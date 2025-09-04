"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Palette, Settings, Wand2 } from 'lucide-react';
import { SketchStyle, SketchType } from '@/types/sketch';
import { sketchService } from '@/services';
import { toast } from 'sonner';

interface SketchConfigProps {
  onCreateSketch: (config: {
    style: SketchStyle;
    type: SketchType;
    method: 'basic' | 'advanced' | 'artistic';
  }) => void;
  disabled?: boolean;
  isCreating?: boolean;
}

export function SketchConfig({
  onCreateSketch,
  disabled = false,
  isCreating = false,
}: SketchConfigProps) {
  const [style, setStyle] = useState<SketchStyle>(SketchStyle.PENCIL);
  const [type, setType] = useState<SketchType>(SketchType.BLACK_AND_WHITE);
  const [method, setMethod] = useState<'basic' | 'advanced' | 'artistic'>('advanced');
  const [availableOptions, setAvailableOptions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvailableOptions = async () => {
      try {
        const options = await sketchService.getAvailableStyles();
        setAvailableOptions(options);
      } catch (error) {
        toast.error('Failed to load sketch options');
        console.error('Error loading sketch options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableOptions();
  }, []);

  const handleCreateSketch = () => {
    onCreateSketch({ style, type, method });
  };

  const getStyleDescription = (styleName: string) => {
    const descriptions: Record<string, string> = {
      pencil: "Classic pencil sketch with fine lines",
      charcoal: "Dark, textured charcoal effect",
      watercolor: "Soft, blended watercolor style",
      ink: "Sharp, high-contrast ink drawing",
      pastel: "Soft pastel colors",
      oil: "Rich oil painting effect",
      acrylic: "Vibrant acrylic paint style",
    };
    return descriptions[styleName.toLowerCase()] || "Artistic sketch style";
  };

  const getMethodDescription = (methodName: string) => {
    return availableOptions?.descriptions?.[methodName] || "Processing method";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading options...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Sketch Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Style Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-gray-500" />
            <Label htmlFor="style" className="text-sm font-medium">
              Sketch Style
            </Label>
          </div>
          <Select
            value={style}
            onValueChange={(value) => setStyle(value as SketchStyle)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              {availableOptions?.styles?.map((styleName: string) => (
                <SelectItem key={styleName} value={styleName}>
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">{styleName}</span>
                    <span className="text-xs text-gray-500">
                      {getStyleDescription(styleName)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Type Selection */}
        <div className="space-y-3">
          <Label htmlFor="type" className="text-sm font-medium">
            Output Type
          </Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as SketchType)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select output type" />
            </SelectTrigger>
            <SelectContent>
              {availableOptions?.types?.map((typeName: string) => (
                <SelectItem key={typeName} value={typeName}>
                  <div className="flex items-center space-x-2">
                    <span className="capitalize">{typeName.replace('_', ' ')}</span>
                    <Badge variant="outline" className="text-xs">
                      {typeName === 'black_and_white' ? 'B&W' : 'Color'}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Method Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-gray-500" />
            <Label htmlFor="method" className="text-sm font-medium">
              Processing Method
            </Label>
          </div>
          <Select
            value={method}
            onValueChange={(value) => setMethod(value as typeof method)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select processing method" />
            </SelectTrigger>
            <SelectContent>
              {availableOptions?.methods?.map((methodName: string) => (
                <SelectItem key={methodName} value={methodName}>
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">{methodName}</span>
                    <span className="text-xs text-gray-500">
                      {getMethodDescription(methodName)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Selection Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Current Selection:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{style}</Badge>
            <Badge variant="secondary">{type.replace('_', ' ')}</Badge>
            <Badge variant="secondary">{method}</Badge>
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateSketch}
          disabled={disabled || isCreating}
          className="w-full"
          size="lg"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Sketch...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Create Sketch
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
