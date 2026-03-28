import { Text as DefaultText, View as DefaultView } from 'react-native';
import { Colors } from '../theme/tokens';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  // We are currently dark-mode only by default, so we use the dark color
  const colorFromProps = props.dark;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[colorName] as string;
  }
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  className?: string; // Add className to type
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, className, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'textPrimary');

  // Spread className into otherProps so NativeWind can pick it up
  return <DefaultText className={className} style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, className, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Spread className into otherProps so NativeWind can pick it up
  return <DefaultView className={className} style={[{ backgroundColor }, style]} {...otherProps} />;
}
