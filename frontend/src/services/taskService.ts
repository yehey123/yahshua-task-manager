import axios from "axios";

const API_BASE_URL = "";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

export type CreateTaskData = Pick<Task, "title" | "description">;
export type UpdateTaskData = Partial<CreateTaskData>;

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>("/tasks/");
    return response.data;
  },

  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await apiClient.post<Task>("/tasks/", data);
    return response.data;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}/`);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskData): Promise<Task> => {
    const response = await apiClient.put<Task>(`/tasks/${id}/`, data);
    return response.data;
  },

  toggleTaskStatus: async (id: number, completed: boolean): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}/`, {
      completed,
    });
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}/`);
  },
};
