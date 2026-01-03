import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Task } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/constants';
import { getDeadlineLabel, getDeadlineUrgency } from '../utils/dateUtils';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
  onDelete: (taskId: string) => void;
}

/**
 * Sophisticated task card with:
 * - Deadline awareness indicators
 * - Smooth completion toggle
 * - Swipe-like delete action
 * - Subtle hover states
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onDelete }) => {
  const deadlineLabel = getDeadlineLabel(task.deadline);
  const urgency = getDeadlineUrgency(task.deadline);

  // Urgency-based styling
  const urgencyColors = {
    critical: COLORS.status.error,
    urgent: COLORS.status.warning,
    normal: COLORS.text.secondary,
  };

  const urgencyColor = urgencyColors[urgency];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        task.isCompleted && styles.cardCompleted,
      ]}
    >
      <View style={styles.cardContent}>
        {/* Completion Checkbox */}
        <TouchableOpacity
          onPress={() => onToggleComplete(task.id, task.isCompleted)}
          style={styles.checkbox}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkboxCircle,
              task.isCompleted && styles.checkboxCircleCompleted,
              !task.isCompleted && { borderColor: COLORS.primary },
            ]}
          >
            {task.isCompleted && (
              <Icon name="check" size={16} color={COLORS.background} />
            )}
          </View>
        </TouchableOpacity>

        {/* Task Details */}
        <View style={styles.taskInfo}>
          <Text
            style={[
              styles.title,
              task.isCompleted && styles.titleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}

          <View style={styles.meta}>
            <Icon name="clock" size={14} color={urgencyColor} />
            <Text style={[styles.deadline, { color: urgencyColor }]}>
              {deadlineLabel}
            </Text>
            <View style={styles.badgeContainer}>
              <PriorityBadge priority={task.priority} size="small" />
            </View>
          </View>
        </View>

        {/* Delete Action */}
        <TouchableOpacity
          onPress={() => onDelete(task.id)}
          style={styles.deleteButton}
          activeOpacity={0.6}
        >
          <Icon name="trash-2" size={20} color={COLORS.status.error} />
        </TouchableOpacity>
      </View>

      {/* Urgency Indicator Strip (left edge) */}
      {!task.isCompleted && urgency !== 'normal' && (
        <View
          style={[
            styles.urgencyStrip,
            { backgroundColor: urgencyColor },
          ]}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardCompleted: {
    opacity: 0.6,
    backgroundColor: COLORS.surfaceLight,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  checkbox: {
    marginRight: SPACING.md,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxCircleCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.text.disabled,
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadline: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: SPACING.xs,
  },
  badgeContainer: {
    marginLeft: SPACING.sm,
  },
  deleteButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  urgencyStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});
