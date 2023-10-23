import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import Animated, { } from 'react-native-reanimated';

export default function StartButton({ handleBox, buttonValue }) {

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, styles.container, {
      transform: [
        { translateY: buttonValue }
      ]
    }]}>
      <TouchableOpacity style={styles.button} onPress={handleBox}>

      </TouchableOpacity>
    </Animated.View>
  );
}