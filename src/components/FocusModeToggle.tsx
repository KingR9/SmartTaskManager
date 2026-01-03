import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FocusMode } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/constants';

interface FocusModeToggleProps {
  currentMode: FocusMode;
  onModeChange: (mode: FocusMode) => void;
}

const MODES: { value: FocusMode; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'TODAY', label: 'Today' },
  { value: 'HIGH_PRIORITY', label: 'High Priority' },
];

/**
 * iOS-style segmented control for focus modes
 * Smooth animations and clear selection state
 */
export const FocusModeToggle: React.FC<FocusModeToggleProps> = ({ currentMode, onModeChange }) => {
  return (
    <View style={styles.container}>
      {MODES.map((mode) => {
        const isActive = currentMode === mode.value;
        return (
          <TouchableOpacity
            key={mode.value}
            onPress={() => onModeChange(mode.value)}
            style={[
              styles.button,
              isActive && styles.buttonActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                isActive && styles.buttonTextActive,
              ]}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  buttonTextActive: {
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
});