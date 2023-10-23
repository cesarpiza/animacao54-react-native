import React from 'react';
import {
  Text,
  View
} from 'react-native';
import { styles } from './styles';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { itemSize } from '../styles/index'

export default function Item({ item, index, scrollX }) {

  const inputRange = [
    itemSize * (index - 1),
    itemSize * index,
    itemSize * (index + 1),
  ]

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          scale: interpolate(scrollX.value,
            inputRange,
            [0.7, 1, 0.7],
            Extrapolate.CLAMP
          )
        }
      ]
    }
  })

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>
        {item}
      </Text>
    </Animated.View>
  );
}