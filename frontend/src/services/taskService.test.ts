import { describe, it, expect, vi, beforeEach } from "vitest";
import { taskService, apiClient } from "./taskService";

describe("taskService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should fetch tasks successfully", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", completed: false, created_at: "2024-01-01" },
      ];
      const spy = vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: mockTasks });

      const result = await taskService.getTasks();

      expect(spy).toHaveBeenCalledWith("/tasks/");
      expect(result).toEqual(mockTasks);
    });
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const newTask = { title: "New Task", description: "Desc" };
      const createdTask = { id: 2, ...newTask, completed: false, created_at: "2024-01-01" };
      const spy = vi.spyOn(apiClient, "post").mockResolvedValueOnce({ data: createdTask });

      const result = await taskService.createTask(newTask);

      expect(spy).toHaveBeenCalledWith("/tasks/", newTask);
      expect(result).toEqual(createdTask);
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      const updatedData = { title: "Updated Title" };
      const updatedTask = { id: 1, title: "Updated Title", completed: false, created_at: "2024-01-01" };
      const spy = vi.spyOn(apiClient, "put").mockResolvedValueOnce({ data: updatedTask });

      const result = await taskService.updateTask(1, updatedData);

      expect(spy).toHaveBeenCalledWith("/tasks/1/", updatedData);
      expect(result).toEqual(updatedTask);
    });
  });

  describe("deleteTask", () => {
    it("should delete a task successfully", async () => {
      const spy = vi.spyOn(apiClient, "delete").mockResolvedValueOnce({});

      await taskService.deleteTask(1);

      expect(spy).toHaveBeenCalledWith("/tasks/1/");
    });
  });

  describe("toggleTaskStatus", () => {
    it("should toggle task status successfully", async () => {
      const updatedTask = { id: 1, title: "Task 1", completed: true, created_at: "2024-01-01" };
      const spy = vi.spyOn(apiClient, "patch").mockResolvedValueOnce({ data: updatedTask });

      const result = await taskService.toggleTaskStatus(1, true);

      expect(spy).toHaveBeenCalledWith("/tasks/1/", { completed: true });
      expect(result).toEqual(updatedTask);
    });
  });
});
