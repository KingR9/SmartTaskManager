import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriorityLevel } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/constants';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'small' | 'medium';
}

/**
 * Displays a color-coded priority badge based on the task's priority level.
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'medium' }) => {
  const priorityConfig = {
    HIGH: { color: COLORS.priority.HIGH, label: 'High' },
    MEDIUM: { color: COLORS.priority.MEDIUM, label: 'Medium' },
    LOW: { color: COLORS.priority.LOW, label: 'Low' },
  };

  const config = priorityConfig[priority];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${config.color}15`, 
          borderColor: config.color,
        },
        isSmall && styles.badgeSmall,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, isSmall && styles.textSmall]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
  },
  badgeSmall: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.xs,
  },
  text: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  textSmall: {
    fontSize: TYPOGRAPHY.sizes.xs,
  },
});
