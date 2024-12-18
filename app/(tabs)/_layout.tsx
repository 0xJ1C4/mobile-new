import { Tabs } from "expo-router";
import React from "react";
import { House, BadgeRussianRuble, QrCodeIcon } from "lucide-react-native";
import { useEffect } from "react";
import { getUser } from "@/helper/session";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getUser();

        if (session) {
          return null;
        } else {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    };
    checkSession();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <QrCodeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Transaction",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <BadgeRussianRuble size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
