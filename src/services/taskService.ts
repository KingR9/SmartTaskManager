import { Task, TaskFormData } from '../types';
import { getUserTasksCollection } from './firebase';
import FirebaseFirestoreTypes from '@react-native-firebase/firestore';

/**
 * Adds a new task to Firestore for the authenticated user
 * Returns the created task with generated ID
 */
export const createTask = async (userId: string, taskData: TaskFormData): Promise<Task> => {
  try {
    const tasksCollection = getUserTasksCollection(userId);
    
    const taskDoc = await tasksCollection.add({
      title: taskData.title,
      description: taskData.description,
      deadline: taskData.deadline,
      priority: taskData.priority,
      createdAt: new Date(),
      isCompleted: false,
    });
    
    return {
      id: taskDoc.id,
      ...taskData,
      createdAt: new Date(),
      isCompleted: false,
    };
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task. Please try again.');
  }
};

/**
 * Fetches all tasks for a user with real-time updates
 * Returns unsubscribe function for cleanup
 */
export const subscribeToTasks = (
  userId: string,
  onTasksUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  const tasksCollection = getUserTasksCollection(userId);
  
  // Real-time listener
  const unsubscribe = tasksCollection.onSnapshot(
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt.toDate(),
          deadline: data.deadline.toDate(),
          priority: data.priority,
          isCompleted: data.isCompleted,
        };
      });
      
      onTasksUpdate(tasks);
    },
    (error) => {
      console.error('Error subscribing to tasks:', error);
      onError(new Error('Failed to load tasks. Please check your connection.'));
    }
  );
  
  return unsubscribe;
};

/**
 * Toggles a task's completion status
 */
export const toggleTaskCompletion = async (userId: string, taskId: string, isCompleted: boolean): Promise<void> => {
  try {
    const tasksCollection = getUserTasksCollection(userId);
    await tasksCollection.doc(taskId).update({
      isCompleted: !isCompleted,
    });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw new Error('Failed to update task. Please try again.');
  }
};

/**
 * Permanently deletes a task
 */
export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  try {
    const tasksCollection = getUserTasksCollection(userId);
    await tasksCollection.doc(taskId).delete();
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task. Please try again.');
  }
};