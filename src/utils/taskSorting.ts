import { Task, PriorityLevel } from '../types';
import { PRIORITY_WEIGHTS } from './constants';

/**
 * Calculates a dynamic urgency score for intelligent task sorting
 * 
 * Formula: urgencyScore = priorityWeight × (1 / hoursRemaining)
 * 
 * Higher score = more urgent
 * - Higher priority multiplies the score
 * - Completed tasks always sink to bottom (score = -Infinity)
 */
export const calculateUrgencyScore = (task: Task): number => {
  // Completed tasks always go to the bottom
  if (task.isCompleted) {
    return -Infinity;
  }
  
  const now = new Date();
  const deadlineTime = task.deadline.getTime();
  const currentTime = now.getTime();
  
  // Calculate hours remaining (can be negative if overdue)
  const millisecondsRemaining = deadlineTime - currentTime;
  const hoursRemaining = millisecondsRemaining / (1000 * 60 * 60);
  
  // Get priority weight
  const priorityWeight = PRIORITY_WEIGHTS[task.priority];
  
  // Handle edge cases
  if (hoursRemaining <= 0) {
    // Overdue tasks get maximum urgency (proportional to how overdue)
    return priorityWeight * 1000 * Math.abs(hoursRemaining);
  }
  
  if (hoursRemaining < 1) {
    // Tasks due within an hour get very high urgency
    return priorityWeight * 1000;
  }
  
  // Standard urgency calculation
  const urgencyScore = priorityWeight * (1 / hoursRemaining);
  
  return urgencyScore;
};

/**
 * Sorts tasks by urgency score (highest first)
 * This creates the "smart" prioritization effect
 */
export const sortTasksByUrgency = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const scoreA = calculateUrgencyScore(a);
    const scoreB = calculateUrgencyScore(b);
    
    // Sort descending (highest urgency first)
    return scoreB - scoreA;
  });
};
