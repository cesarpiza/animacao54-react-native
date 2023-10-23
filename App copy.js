import * as React from 'react';
import {
  Vibration,
  StatusBar,
  Dimensions,
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import Duration from './duration'

const { width, height } = Dimensions.get('window');
const colors = {
  black: '#323F4E',
  red: '#F76A6A',
  text: '#ffffff',
};

const timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width * 0.38;
const BUTTON_SIZE = width * 0.23;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function App() {

  const scrollX = useSharedValue(0)
  const button = useSharedValue(0)
  const box = useSharedValue(height)
  const [statusOpacity, setStatusOpacity] = React.useState(false)
  const [statusOpacityTimer, setStatusOpacityTimer] = React.useState(false)
  const [_index, setIndex] = React.useState(0)
  const timer = useSharedValue(timers[_index])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x
    }
  });

  const handleButton = () => {
    setStatusOpacity(true)
    button.value = withTiming(1, {
      duration: 500,
    }),

      box.value = withDelay(500, withSequence(
        withTiming(0, {
          duration: 500,
        }, () => {
          runOnJS(setStatusOpacityTimer)(true)
          timer.value = timers[_index]
          timer.value = withTiming(0, {
            duration: 1000 * timers[_index],
            easing: Easing.linear,
          })
        }),
        withTiming(height, {
          duration: 1000 * timers[_index],
          easing: Easing.linear,
        }, () => {
          button.value = withTiming(0, {
            duration: 500,
          })
          runOnJS(Vibration.cancel)() // Cancela a vibração
          runOnJS(Vibration.vibrate)() // Em vibrate da para colocar quantos segundos vibrar ex: runOnJS(Vibration.vibrate)(5000) = 5 segundos.
          timer.value = timers[_index]
          runOnJS(setStatusOpacity)(false)
          runOnJS(setStatusOpacityTimer)(false)
        })
      ))
  }

  const animatedStylesButton = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(button.value,
            [0, 1],
            [0, 200],
          ),
        }
      ]
    }
  })

  const animatedStylesBox = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: box.value,
        }
      ]
    }
  })

  const count = useDerivedValue(() => {
    return Math.round(timer.value).toString()
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View style={[animatedStylesBox, StyleSheet.absoluteFillObject, {
        backgroundColor: colors.red
      }]} />
      <Animated.View style={[animatedStylesButton, StyleSheet.absoluteFillObject, {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 100,
      }]}>
        <TouchableOpacity style={{
          backgroundColor: colors.red,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
        }} onPress={handleButton}>

        </TouchableOpacity>
      </Animated.View>
      <View style={{
        alignItems: 'center',
      }}>
        <ReText text={count} style={[styles.duration, {
          opacity: statusOpacityTimer ? 1 : 0
        }]} />
        <AnimatedFlatList
          onScroll={scrollHandler}
          horizontal
          scrollEnabled={!statusOpacity}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          decelerationRate={'fast'}
          contentContainerStyle={{
            paddingHorizontal: ITEM_SPACING,
          }}
          onMomentumScrollEnd={(event) => {
            setIndex(Math.round(event.nativeEvent.contentOffset.x / ITEM_SIZE));
          }}
          style={{
            flexGrow: 0,
          }}
          data={timers}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => {

            return (
              <Duration statusOpacityTimer={statusOpacityTimer} _index={_index} statusOpacity={statusOpacity} scrollX={scrollX} item={item} index={index} />
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
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  duration: {
    fontSize: 124,
    fontWeight: 'bold',
    color: colors.text,
    position: 'absolute',
  }
});