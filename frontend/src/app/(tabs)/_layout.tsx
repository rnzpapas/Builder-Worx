import { Stack } from "expo-router";

export default function RootStack(){
    return(
        <Stack> 
            <Stack.Screen name="index" options={{headerShown: false}}/>
            <Stack.Screen name="register" options={{headerShown: false}}/>
            <Stack.Screen name="client" options={{headerShown: false}} />
            <Stack.Screen name="worker" options={{headerShown: false}} />
            <Stack.Screen name="admin" options={{headerShown: false}} />
        </Stack>
    )
}