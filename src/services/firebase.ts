
```typescript
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * Centralized Firebase service configuration
 * Provides typed access to Firebase Auth and Firestore
 */
export const firebaseAuth = auth;
export const firebaseDB = firestore;

/**
 * Collection references for type safety
 */
export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
} as const;

/**
 * Helper to get user-specific task collection reference
 * Ensures data isolation per user
 */
export const getUserTasksCollection = (userId: string) => {
  return firebaseDB().collection(COLLECTIONS.USERS).doc(userId).collection(COLLECTIONS.TASKS);
};
```

---