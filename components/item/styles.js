import { StyleSheet } from 'react-native';
import { itemSize, colors } from '../styles/index'

export const styles = StyleSheet.create({
    container: {
        width: itemSize,
        alignItems: 'center',
    },
    text: {
        fontSize: 124,
        fontWeight: 'bold',
        color: colors.text,
    }
});