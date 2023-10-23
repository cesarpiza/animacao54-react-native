import React, { useState } from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Vibration,
} from 'react-native';
import Item from './components/item/index';
import StartButton from './components/startButton/index';
import { itemSize, colors, SPACING } from './components/styles/index'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withSequence,
  withTiming,
  withDelay,
  useAnimatedStyle,
  useDerivedValue,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';

const numbersList = [...Array(13).keys()].map((item) => (item == 0 ? 1 : item * 5));
const { width, height } = Dimensions.get('window');

export default function App() {

  const scrollX = useSharedValue(0);
  const buttonValue = useSharedValue(0);
  const boxValue = useSharedValue(height);
  const timer = useSharedValue(numbersList[0]);
  const [_index, setIndex] = useState(0);
  const [statusOpacity, setStatusOpacity] = useState(false)

  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x
    }
  })

  const handleBox = () => {
    setStatusOpacity(true)
    buttonValue.value = withTiming(200, {
      duration: 500,
    })
    boxValue.value = withDelay(500,
      withSequence(
        withTiming(0, {
          duration: 500,
        }, () => {
          timer.value = withTiming(0, {
            duration: 1000 * numbersList[_index],
            easing: Easing.linear
          })
        }),
        withTiming(height, {
          duration: 1000 * numbersList[_index],
          easing: Easing.linear
        }, () => {
          timer.value = numbersList[_index]
          runOnJS(setStatusOpacity)(false)
          buttonValue.value = withTiming(0, {
            duration: 500
          })
          runOnJS(Vibration.cancel)() // Cancela a vibração
          runOnJS(Vibration.vibrate)() // Em vibrate da para colocar quantos segundos vibrar ex: runOnJS(Vibration.vibrate)(5000) = 5 segundos.
        }),
      )
    )
  }

  const animatedStylesBox = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: boxValue.value,
        }
      ]
    }
  })

  const timers = useDerivedValue(() => {
    return Math.round(timer.value).toString();
  })

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View
        style={[animatedStylesBox, StyleSheet.absoluteFillObject, {
          backgroundColor: colors.button,
          // Aparentemente da problema na animação quando usa o valor animado direto no style do elemento igual aí em baixo. Tem que usar no useAnimatedStyle. Já no Animated padrão "não" tem problema.
          /* transform: [
            {
              translateY: boxValue.value,
            }
          ] */
        }]}
      />
      <StartButton handleBox={handleBox} buttonValue={buttonValue} />
      <View style={{
        position: 'absolute',
        top: height / 3,
        alignItems: 'center'
      }}>
        <ReText text={timers} style={{
          opacity: statusOpacity ? 1 : 0,
          fontSize: 124,
          fontWeight: 'bold',
          color: colors.text,
          position: 'absolute',
        }} />
        <Animated.FlatList
          onScroll={handleScroll}
          onMomentumScrollEnd={(event) => {
            setIndex(Math.round(event.nativeEvent.contentOffset.x / itemSize))
            setIndex(prevState => {
              timer.value = numbersList[prevState]
              return prevState
            })
          }}
          contentContainerStyle={{
            paddingHorizontal: SPACING,
          }}
          style={{
            flexGrow: 0,
            opacity: !statusOpacity ? 1 : 0
          }}
          snapToInterval={itemSize}
          scrollEnabled={!statusOpacity}
          decelerationRate={'fast'}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={numbersList}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => {
            return (
              <Item item={item} index={index} scrollX={scrollX} />
            )
          }}
        />
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});