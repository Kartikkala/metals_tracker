import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home page */}
      <Stack.Screen name="index" />
      {/* Details page */}
      <Stack.Screen name="details" />
    </Stack>
  );
}
