import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { taskService } from "@/services/taskService";

// Mock taskService
vi.mock("@/services/taskService", () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskStatus: vi.fn(),
  },
}));

// Mock ResizeObserver which is used by some Radix UI components
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders task manager title", async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue([]);
    render(<App />);
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
  });

  it("shows empty state when no tasks are found", async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue([]);
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });
  });

  it("renders a list of tasks", async () => {
    const mockTasks = [
      { id: 1, title: "Test Task 1", description: "Desc 1", completed: false, created_at: "2024-01-01" },
      { id: 2, title: "Test Task 2", description: "Desc 2", completed: true, created_at: "2024-01-02" },
    ];
    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
  });
});
