import React from 'react';
import { FontAwesome6 } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@components/useColorScheme';
import { useClientOnlyValue } from '@components/useClientOnlyValue';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }) {
    return <FontAwesome size={26} style={{ marginBottom: -3 }} {...props} />;
  }
function TabBarIcon6(props: {
  name: React.ComponentProps<typeof FontAwesome6>['name'];
  color: string;
}) {
  return <FontAwesome6 size={26} style={{ marginBottom: -3 }} {...props} />;
}
function TabBarIconMaterial(props: {
    name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    color: string;
  }) {
    return <MaterialCommunityIcons size={26} style={{ marginBottom: -3 }} {...props} />;
  }
export default function ClientLayout() {
    const colorScheme = useColorScheme();
  
    return (
      <Tabs
        screenOptions={{
          headerShown: useClientOnlyValue(false, false),
        }}
        >
        <Tabs.Screen name="index" options={{href: null}}/>
        <Tabs.Screen
          name="(dashboard)"
          options={{
            tabBarLabelStyle:{fontSize: 16, fontFamily: 'Karla'},
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <TabBarIconMaterial name="view-dashboard" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(workers)"
          options={{
            tabBarLabelStyle:{fontSize: 16, fontFamily: 'Karla'},
            title: 'Workers',
            tabBarIcon: ({ color }) => <TabBarIcon6 name="hammer" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(bookings)"
          options={{
            tabBarLabelStyle:{fontSize: 16, fontFamily: 'Karla'},
            title: 'Bookings',
            tabBarIcon: ({ color }) => <TabBarIcon6 name="receipt" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            tabBarLabelStyle:{fontSize: 16, fontFamily: 'Karla'},
            title: 'Profile',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
    );
}