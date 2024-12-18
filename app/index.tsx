import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { saveSessionFromQr, getUser } from "@/helper/session";
import Overlay from "@/components/ui/qrOverlay";
import { en, registerTranslation } from "react-native-paper-dates";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

registerTranslation("en", en);

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function LoginScreen() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const router = useRouter();
  const qrLock = useRef(false);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!permission) {
    return <View />;
  }

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    const { data } = result;
    if (data && !qrLock.current) {
      qrLock.current = true;
      try {
        setIsLoading(true);
        await saveSessionFromQr(data);

        const user = await getUser();
        if (user) {
          setScanned(false);
          setIsLoading(false);
          router.replace("/(tabs)");
        }
        return router.reload();
      } catch (error) {
        qrLock.current = false;
        setScanned(false);
        setIsLoading(false);
        router.reload();
      }
    }
  };

  if (!permission.granted) {
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={
          scanned ? undefined : (result) => handleBarCodeScanned(result)
        }
      >
        <View style={styles.buttonContainer}></View>
      </CameraView>
      <Overlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
