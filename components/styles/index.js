import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const itemSize = width * 0.4;
export const buttonSize = 100;
export const colors = {
    background: '#506360',
    button: '#E37044',
    box: '#5AA396',
    text: '#FFFF'
};
export const SPACING = (width - itemSize) / 2;