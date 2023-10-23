import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = width * 0.38;
const colors = {
    black: '#323F4E',
    red: '#F76A6A',
    text: '#ffffff',
};

export default function Duration({ statusOpacityTimer, scrollX, _index, item, index, statusOpacity }) {

    const animatedStyles = useAnimatedStyle(() => {

        const inputRange = [
            ITEM_SIZE * (index - 1),
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 1),
        ]

        return {
            transform: [
                {
                    scale: interpolate(scrollX.value,
                        inputRange,
                        [0.7, 1, 0.7],
                        Extrapolation.CLAMP,
                    ),
                }
            ],
            opacity: interpolate(scrollX.value,
                inputRange,
                [0.3, 1, 0.3],
                Extrapolation.CLAMP,
            )
        }
    })

    return (
        <View style={{
            opacity: !statusOpacityTimer ? 1 : 0
        }}>
            <View style={[styles.durationContainer, {
                opacity: statusOpacity && _index != index ? 0 : 1,
            }]}>
                <Animated.Text style={[styles.duration, animatedStyles]}>
                    {item}
                </Animated.Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    durationContainer: {
        width: ITEM_SIZE,
        //backgroundColor: 'red',
        //borderWidth: 1,
        alignItems: 'center',
    },
    duration: {
        fontSize: 124,
        fontWeight: 'bold',
        color: colors.text,
    }
});