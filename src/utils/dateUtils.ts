import { differenceInHours, differenceInDays, format, isToday, isTomorrow, isPast } from 'date-fns';

/**
 * Converts a date into a human-friendly deadline label
 * Examples: "Due in 2 hours", "Due tomorrow", "Overdue by 3 days"
 */
export const getDeadlineLabel = (deadline: Date): string => {
  const now = new Date();
  
  // Task is overdue
  if (isPast(deadline) && !isToday(deadline)) {
    const daysOverdue = Math.abs(differenceInDays(deadline, now));
    if (daysOverdue === 1) return 'Overdue by 1 day';
    return `Overdue by ${daysOverdue} days`;
  }
  
  // Task is due today
  if (isToday(deadline)) {
    const hoursRemaining = differenceInHours(deadline, now);
    
    if (hoursRemaining < 0) return 'Overdue (today)';
    if (hoursRemaining === 0) return 'Due in less than 1 hour';
    if (hoursRemaining === 1) return 'Due in 1 hour';
    if (hoursRemaining < 24) return `Due in ${hoursRemaining} hours`;
  }
  
  // Task is due tomorrow
  if (isTomorrow(deadline)) {
    return 'Due tomorrow';
  }
  
  // Task is due in the future
  const daysUntil = differenceInDays(deadline, now);
  if (daysUntil <= 7) {
    return `Due in ${daysUntil} days`;
  }
  
  // Default: show formatted date
  return `Due ${format(deadline, 'MMM dd, yyyy')}`;
};

/**
 * Determines the urgency level based on deadline proximity
 * Used for visual indicators (colors, icons)
 */
export const getDeadlineUrgency = (deadline: Date): 'critical' | 'urgent' | 'normal' => {
  const now = new Date();
  const hoursRemaining = differenceInHours(deadline, now);
  
  if (hoursRemaining < 0) return 'critical'; // Overdue
  if (hoursRemaining <= 24) return 'urgent'; // Within 24 hours
  return 'normal';
};

/**
 * Checks if a task's deadline falls within today
 */
export const isTaskDueToday = (deadline: Date): boolean => {
  return isToday(deadline);
};

/**
 * ========================================
 * SMART TASK SORTING ALGORITHM
 * ========================================
 * Dynamic urgency scoring system
 */