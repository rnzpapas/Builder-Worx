import { Stack, Navigator } from "expo-router";
export default function ProfileStack() {
    return (
        <Stack>
            <Stack.Screen name="[id]"  options={{headerShown: false}}/>    
            <Stack.Screen name="profile_info" options={{headerShown: false}}/>    
            <Stack.Screen name="change_password" options={{headerShown: false}}/>    
        </Stack>
    )
}