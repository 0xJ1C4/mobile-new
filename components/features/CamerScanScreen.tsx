import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect } from "react";
import { Camera } from "expo-camera";
import { getReceiptContent } from "@/helper/receipt";
import LoadingIndicator from "../ui/LoadingIndicator";
import { useRouter } from "expo-router";
import { useReceipt } from "@/provider/ReceiptProvider";
import { uriToBlob } from "@/helper/receipt";

import RCOverlay from "../ui/ReceiptOverLay";

import { Ionicons } from "@expo/vector-icons";

//import RCOverlay from "./RCOverlay";

export default function CameraScreen() {
  const [type, setType] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [facing] = useState<CameraType>("back");

  const [torch, setTorch] = useState(false);

  const { setReceiptData } = useReceipt();
  const router = useRouter();

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermission();
  });

  if (!hasPermission) {
    // Camera permissions are still loading
    return <View />;
  }

  const toggleTorch = () => {
    setTorch((current) => !current);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={() => console.log("hello")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraType() {
    setType((current: string) => (current === "back" ? "front" : "back"));
  }
  let options = {
    quality: 0,
    base64: true,
    exif: false,
    height: 1000,
    width: 800,
  };
  async function takePicture() {
    if (cameraRef.current) {
      const currentPhoto = await cameraRef.current.takePictureAsync(options);
      const blob = await uriToBlob(currentPhoto?.uri || "");
      setIsLoading(true);
      const content = await getReceiptContent(currentPhoto?.base64 || "");

      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      setIsLoading(false);

      if (content) {
        const transformedData = {
          ...content?.message,
          items: content?.message.items.map((item: any) => ({
            ...item,
            unit_price: item.unit_price.toString(),
            amount: item.amount.toString(),
          })),
          total: content?.message?.total.toString(),
          image: currentPhoto?.base64,
          imageFile: file,
        };

        setReceiptData(transformedData);
        router.push("/scan-receipt");
      }
    }
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={torch}
        ref={cameraRef}
      >
        <RCOverlay isTorchOn={torch} />
        <Pressable style={styles.torchButton} onPress={toggleTorch}>
          <Ionicons
            name={torch ? "flash" : "flash-off"}
            size={30}
            color="white"
          />
        </Pressable>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Ionicons name="scan-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    height: 75,
    width: 75,
    backgroundColor: "white",
    borderRadius: 75 / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
  },
  torchButton: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    height: 50,
    width: 50,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "black",
  },
});
