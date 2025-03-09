import { Stack } from "expo-router";

export default function BookingsStack(){
    return(
        <Stack>
            <Stack.Screen name="bookinghome" options={{headerShown: false}}/>
            <Stack.Screen name="booking" options={{headerShown: false}}/>
            <Stack.Screen name="map" options={{headerShown: false}}/>
        </Stack>
    )
}