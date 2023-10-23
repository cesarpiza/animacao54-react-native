import { StyleSheet } from 'react-native';
import { buttonSize, colors } from '../styles/index'

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 100,
    },
    button: {
        width: buttonSize,
        height: buttonSize,
        borderRadius: buttonSize / 2,
        backgroundColor: colors.button
    }
});