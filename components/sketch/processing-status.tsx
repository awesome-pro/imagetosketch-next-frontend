"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye
} from 'lucide-react';
import { TaskStatusResponse } from '@/services/sketch.service';
import { cn } from '@/lib/utils';

interface ProcessingStatusProps {
  tasks: Map<string, TaskStatusResponse>;
  onDownload?: (taskId: string) => void;
  onView?: (taskId: string) => void;
  className?: string;
}

export function ProcessingStatus({
  tasks,
  onDownload,
  onView,
  className,
}: ProcessingStatusProps) {
  const taskArray = Array.from(tasks.values()).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'timeout':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'timeout':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'running':
        return 50;
      case 'completed':
        return 100;
      case 'failed':
      case 'timeout':
        return 0;
      default:
        return 0;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getElapsedTime = (startTime: string, endTime?: string) => {
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    const elapsed = Math.floor((end - start) / 1000);
    
    if (elapsed < 60) return `${elapsed}s`;
    if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
    return `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m`;
  };

  if (taskArray.length === 0) {
    return null;
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Processing Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {taskArray.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 space-y-3 bg-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(task.status)}
                <span className="font-medium text-sm">
                  Task {task.id.slice(0, 8)}...
                </span>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getStatusColor(task.status))}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-500">
                {formatTime(task.created_at)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress 
                value={getProgress(task.status)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {task.status === 'running' ? 'Processing...' : 
                   task.status === 'completed' ? 'Complete' :
                   task.status === 'failed' ? 'Failed' :
                   task.status === 'pending' ? 'Queued' : 'Unknown'}
                </span>
                <span>
                  {getElapsedTime(task.created_at, task.updated_at)}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {task.error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {task.error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {task.status === 'completed' && (
              <div className="flex space-x-2 pt-2">
                {onView && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(task.id)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                )}
                {onDownload && (
                  <Button
                    size="sm"
                    onClick={() => onDownload(task.id)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
