import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Task, TaskFormData, FocusMode, ProductivityStats } from '../types';
import { useAuth } from './AuthContext';
import {
  subscribeToTasks,
  createTask,
  toggleTaskCompletion,
  deleteTask,
} from '../services/taskService';
import { sortTasksByUrgency } from '../utils/taskSorting';
import { isTaskDueToday } from '../utils/dateUtils';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  focusMode: FocusMode;
  stats: ProductivityStats;
  addTask: (taskData: TaskFormData) => Promise<void>;
  toggleComplete: (taskId: string, isCompleted: boolean) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  setFocusMode: (mode: FocusMode) => void;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * Task Provider Component
 * Manages all task-related state and operations
 */
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState<FocusMode>('ALL');

  /**
   * Real-time task subscription
   * Automatically updates when tasks change in Firestore
   */
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToTasks(
      user.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup subscription when user changes or component unmounts
    return unsubscribe;
  }, [user]);

  /**
   * Smart filtering based on focus mode
   * Applies user-selected filters dynamically
   */
  const filteredTasks = React.useMemo(() => {
    let filtered = [...tasks];

    // Apply focus mode filters
    if (focusMode === 'TODAY') {
      filtered = filtered.filter((task) => !task.isCompleted && isTaskDueToday(task.deadline));
    } else if (focusMode === 'HIGH_PRIORITY') {
      filtered = filtered.filter((task) => !task.isCompleted && task.priority === 'HIGH');
    }

    // Sort by urgency (smart sorting algorithm)
    return sortTasksByUrgency(filtered);
  }, [tasks, focusMode]);

  /**
   * Calculates productivity statistics
   * Updates in real-time as tasks change
   */
  const stats = React.useMemo((): ProductivityStats => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const completedToday = tasks.filter(
      (task) =>
        task.isCompleted &&
        task.createdAt >= todayStart
    ).length;

    const pendingTasks = tasks.filter((task) => !task.isCompleted).length;

    const overdueCount = tasks.filter(
      (task) => !task.isCompleted && task.deadline < now
    ).length;

    return {
      completedToday,
      pendingTasks,
      overdueCount,
    };
  }, [tasks]);

  /**
   * Creates a new task with validation
   */
  const addTask = async (taskData: TaskFormData): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      await createTask(user.uid, taskData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Toggles task completion status
   */
  const toggleComplete = async (taskId: string, isCompleted: boolean): Promise<void> => {
    if (!user) return;

    try {
      setError(null);
      await toggleTaskCompletion(user.uid, taskId, isCompleted);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Deletes a task permanently
   */
  const removeTask = async (taskId: string): Promise<void> => {
    if (!user) return;

    try {
      setError(null);
      await deleteTask(user.uid, taskId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Clears error state
   */
  const clearError = () => {
    setError(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        loading,
        error,
        focusMode,
        stats,
        addTask,
        toggleComplete,
        removeTask,
        setFocusMode,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

/**
 * Custom hook for accessing task context
 * Throws error if used outside TaskProvider
 */
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};