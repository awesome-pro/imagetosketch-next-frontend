import { api } from "@/lib/api";
import { Sketch, SketchStyle, SketchType, SketchStatus } from "@/types/sketch";

export interface CreateSketchRequest {
  input_key: string;
  style?: SketchStyle;
  sketch_type?: SketchType;
  method?: 'basic' | 'advanced' | 'artistic';
}

export interface CreateSketchResponse {
  sketch_id: number;
  task_id: string;
  status: SketchStatus;
  message: string;
}

export interface TaskStatusResponse {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout';
  created_at: string;
  updated_at?: string;
  function: string;
  error?: string;
  result?: any;
}

export interface AvailableStylesResponse {
  styles: string[];
  types: string[];
  methods: string[];
  descriptions: {
    basic: string;
    advanced: string;
    artistic: string;
  };
}

const sketchService = {
  /**
   * Create a new sketch processing job
   */
  createSketch: async (request: CreateSketchRequest): Promise<CreateSketchResponse> => {
    const response = await api.post<CreateSketchResponse>('/sketch/create', null, {
      params: request,
    });
    return response.data;
  },

  /**
   * Get sketch by ID
   */
  getSketch: async (sketchId: number): Promise<Sketch> => {
    const response = await api.get<Sketch>(`/sketch/${sketchId}`);
    return response.data;
  },

  /**
   * List user sketches
   */
  listSketches: async (params?: {
    skip?: number;
    limit?: number;
    status_filter?: SketchStatus;
  }): Promise<Sketch[]> => {
    const response = await api.get<Sketch[]>('/sketch/', { params });
    return response.data;
  },

  /**
   * Get task status
   */
  getTaskStatus: async (taskId: string): Promise<TaskStatusResponse> => {
    const response = await api.get<TaskStatusResponse>(`/sketch/task/${taskId}`);
    return response.data;
  },

  /**
   * Delete sketch
   */
  deleteSketch: async (sketchId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/sketch/${sketchId}`);
    return response.data;
  },

  /**
   * Get available styles and methods
   */
  getAvailableStyles: async (): Promise<AvailableStylesResponse> => {
    const response = await api.get<AvailableStylesResponse>('/sketch/styles/available');
    return response.data;
  },

  /**
   * Poll task status until completion
   */
  pollTaskStatus: async (
    taskId: string,
    onStatusUpdate?: (status: TaskStatusResponse) => void,
    maxAttempts: number = 60,
    intervalMs: number = 2000
  ): Promise<TaskStatusResponse> => {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;
          const status = await sketchService.getTaskStatus(taskId);
          onStatusUpdate?.(status);
          
          if (status.status === 'completed' || status.status === 'failed') {
            resolve(status);
            return;
          }
          
          if (attempts >= maxAttempts) {
            reject(new Error('Polling timeout: Task did not complete within the expected time'));
            return;
          }
          
          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };
      
      poll();
    });
  },
};

export default sketchService;
