```typescript
/**
 * Core type definitions for the Smart Task Manager
 * Centralized for consistency across the application
 */

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type FocusMode = 'ALL' | 'TODAY' | 'HIGH_PRIORITY';

/**
 * Task entity representing a user's to-do item
 * Includes computed urgency for smart sorting
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  deadline: Date;
  priority: PriorityLevel;
  isCompleted: boolean;
}

/**
 * User authentication state
 */
export interface User {
  uid: string;
  email: string | null;
}

/**
 * Form data for creating/editing tasks
 */
export interface TaskFormData {
  title: string;
  description: string;
  deadline: Date;
  priority: PriorityLevel;
}

/**
 * Productivity metrics displayed to user
 */
export interface ProductivityStats {
  completedToday: number;
  pendingTasks: number;
  overdueCount: number;
}
```

---