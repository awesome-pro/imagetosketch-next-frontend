import { useState, useCallback, useEffect } from 'react';
import { sketchService, websocketService } from '@/services';
import { Sketch, SketchStatus, SketchStyle, SketchType } from '@/types/sketch';
import { CreateSketchRequest, TaskStatusResponse } from '@/services/sketch.service';
import { toast } from 'sonner';

export interface SketchState {
  sketches: Sketch[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  processingTasks: Map<string, TaskStatusResponse>;
}

export interface UseSketchReturn extends SketchState {
  createSketch: (request: CreateSketchRequest) => Promise<void>;
  loadSketches: () => Promise<void>;
  deleteSketch: (sketchId: number) => Promise<void>;
  getSketch: (sketchId: number) => Promise<Sketch>;
  refreshSketch: (sketchId: number) => Promise<void>;
}

export function useSketch(): UseSketchReturn {
  const [state, setState] = useState<SketchState>({
    sketches: [],
    isLoading: false,
    isCreating: false,
    error: null,
    processingTasks: new Map(),
  });

  // Subscribe to WebSocket task updates
  useEffect(() => {
    const unsubscribe = websocketService.subscribeToTaskUpdates((data) => {
      setState(prev => {
        const newTasks = new Map(prev.processingTasks);
        newTasks.set(data.task_id, {
          id: data.task_id,
          status: data.status as any,
          created_at: data.timestamp,
          updated_at: data.timestamp,
          function: 'process_sketch_background',
          error: data.error,
          result: data.result,
        });
        
        return {
          ...prev,
          processingTasks: newTasks,
        };
      });

      // Show toast notification for completed/failed tasks
      if (data.status === 'completed') {
        toast.success('Sketch processing completed!');
        // Refresh sketches to get the updated data
        loadSketches();
      } else if (data.status === 'failed') {
        toast.error(`Sketch processing failed: ${data.error || 'Unknown error'}`);
      }
    });

    return unsubscribe;
  }, []);

  const createSketch = useCallback(async (request: CreateSketchRequest): Promise<void> => {
    setState(prev => ({ ...prev, isCreating: true, error: null }));

    try {
      const response = await sketchService.createSketch(request);
      
      // Add task to processing tasks
      setState(prev => {
        const newTasks = new Map(prev.processingTasks);
        newTasks.set(response.task_id, {
          id: response.task_id,
          status: 'pending',
          created_at: new Date().toISOString(),
          function: 'process_sketch_background',
        });
        
        return {
          ...prev,
          isCreating: false,
          processingTasks: newTasks,
        };
      });

      toast.success('Sketch processing started!');
      
      // Refresh sketches to include the new one
      await loadSketches();
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create sketch';
      setState(prev => ({ 
        ...prev, 
        isCreating: false, 
        error: errorMessage 
      }));
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const loadSketches = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const sketches = await sketchService.listSketches({
        limit: 50,
        skip: 0,
      });
      
      setState(prev => ({ 
        ...prev, 
        sketches, 
        isLoading: false 
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load sketches';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      toast.error(errorMessage);
    }
  }, []);

  const deleteSketch = useCallback(async (sketchId: number): Promise<void> => {
    try {
      await sketchService.deleteSketch(sketchId);
      
      setState(prev => ({
        ...prev,
        sketches: prev.sketches.filter(s => s.id !== sketchId),
      }));
      
      toast.success('Sketch deleted successfully');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete sketch';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const getSketch = useCallback(async (sketchId: number): Promise<Sketch> => {
    try {
      const sketch = await sketchService.getSketch(sketchId);
      
      // Update the sketch in the list if it exists
      setState(prev => ({
        ...prev,
        sketches: prev.sketches.map(s => s.id === sketchId ? sketch : s),
      }));
      
      return sketch;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to get sketch';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const refreshSketch = useCallback(async (sketchId: number): Promise<void> => {
    await getSketch(sketchId);
  }, [getSketch]);

  return {
    ...state,
    createSketch,
    loadSketches,
    deleteSketch,
    getSketch,
    refreshSketch,
  };
}
