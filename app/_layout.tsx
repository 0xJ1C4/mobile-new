import { Slot } from "expo-router";
import "../global.css";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { ReceiptProvider } from "@/provider/ReceiptProvider";
import { theme } from "../constants/theme";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getUser } from "@/helper/session";

export default function Main() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const session = await getUser();

      if (session) return router.push("/(tabs)");

      return router.push("/");
    };

    check();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <ReceiptProvider>
        <Slot />
      </ReceiptProvider>
    </PaperProvider>
  );
}
