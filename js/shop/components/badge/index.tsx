import React, { ReactNode, memo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  GestureResponderEvent,
} from 'react-native';
import { sc375 } from '../../utils/screen';

type type = 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  text: number;
  max?: number;
  isDot?: boolean;
  onClick?: (e?: GestureResponderEvent) => void;
  children?: ReactNode;
  type?: type;
}

export const Badge = ({
  text,
  max = 99,
  isDot,
  onClick,
  children,
  type = 'primary',
}: BadgeProps) => {
  if (!text) {
    return;
  }
  const RenderText = memo(() => (isDot ? '' : +text > max ? `${max}+` : text));
  const dotStyle = !isDot ?  {} : styles.dotStyle;
  return (
    <View style={styles.badgeContainer}>
      {children}
      <Text onPress={onClick} style={{ ...styles[type], ...dotStyle }}>
        <RenderText />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'relative',
    display: 'flex',
  },
  primary: {
    backgroundColor: '#2979ff',
  },
  success: {
    backgroundColor: '#4cd964',
  },
  warning: {
    backgroundColor: '#f0ad4e',
  },
  error: {
    backgroundColor: '#dd524d',
  },
  info: {
    backgroundColor: '#909399',
  },
  flex: {
    display: 'flex',
  },
  dotStyle: {
    width: '10px',
    minWidth: '0',
    height: '10px',
    padding: '0',
    borderRadius: 10,
  },
  item: {
    flex: 1,
  },
  direction: {
    flexDirection: 'row',
  },
});
