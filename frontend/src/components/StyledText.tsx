import { Text, TextProps } from './Themed';

export function ModText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Karla' }]} />;
}
export function MedModText(props: TextProps){
  return <Text {...props} style={[props.style, {fontFamily: 'KarlaMedium'}]} />;
}
export function BoldModText(props: TextProps){
  return <Text {...props} style={[props.style, {fontFamily: 'KarlaBold'}]} />;
}
export function ExtraBoldModText(props: TextProps){
  return <Text {...props} style={[props.style, {fontFamily: 'KarlaExtraBold'}]} />;
}