import { Slot } from "expo-router";
import { Stack } from "expo-router/stack";

export default function Main() {
  return (
    <Stack>
      <Stack.Screen
        name="edit-transaction"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="add-transaction"
        options={{ title: "Home", headerShown: false }}
      />
    </Stack>
  );
}
