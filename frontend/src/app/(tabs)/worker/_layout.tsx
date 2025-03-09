import { FontAwesome6 } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@components/useColorScheme';
import { useClientOnlyValue } from '@components/useClientOnlyValue';

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
          name="(home)"
          options={{
            tabBarLabelStyle:{fontSize: 16, fontFamily: 'Karla'},
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(bookings)"
          options={{
            tabBarLabelStyle:{fontSize: 16, fontFamily: 'Karla'},
            title: 'Bookings',
            tabBarIcon: ({ color }) => <TabBarIcon6 name="hammer" color={color} />,
          }}
        />
        <Tabs.Screen
          name="activities"
          options={{
            tabBarLabelStyle:{fontSize: 16, fontFamily: 'Karla'},
            title: 'Activities',
            tabBarIcon: ({ color }) => <TabBarIcon6 name="receipt" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            tabBarLabelStyle:{fontSize: 16, fontFamily: 'Karla'},
            title: 'Account',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
    );
}