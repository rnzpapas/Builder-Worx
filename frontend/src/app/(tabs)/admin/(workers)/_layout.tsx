import { Stack } from "expo-router";

export default function workerStack(){
    return(
        <Stack>
            <Stack.Screen name="workers" options={{headerShown: false}}/>
            <Stack.Screen name="worker_profile" options={{headerShown: false}}/>
            <Stack.Screen name="register_worker" options={{headerShown: false}}/>
        </Stack>
    )
}