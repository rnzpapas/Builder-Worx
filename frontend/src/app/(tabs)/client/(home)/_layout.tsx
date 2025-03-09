import { Stack } from "expo-router";
export default function HomeStack() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}}/>    
            <Stack.Screen name="[id]"  options={{headerShown: false}}/> 
            <Stack.Screen name="book_info" options={{headerShown: false}}/>
            <Stack.Screen name="map" options={{headerShown: false}}/>   
        </Stack>
    )
}