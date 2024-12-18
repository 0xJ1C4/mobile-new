import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, HelperText, Title } from "react-native-paper";
import { useRouter } from "expo-router";
import { signInUser } from "@/helper/user";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingIndicator from "./ui/LoadingIndicator";
import { saveSessionFromQr } from "@/helper/session";

type RootStackParamList = {
  Login: undefined;
  QRCode: undefined;
};

// type LoginScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   "Login"
// >;

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [animation] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);

  const Logo = require("../assets/images/logo.png");

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      const user = await signInUser({
        email: formData.email,
        password: formData.password,
      });
      setLoading(false);
      if (user) {
        await saveSessionFromQr(user);

        router.push("/(tabs)");
      }
    } else {
      console.log("Form has errors");
    }
  };

  const handleQRCodeNavigation = () => {
    router.push("/");
  };

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.lapaganaLogo} />
        </View>

        <Title style={styles.title}>Log In</Title>

        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!errors.email}
        />
        <HelperText type="error" visible={!!errors.email}>
          {errors.email}
        </HelperText>
        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          mode="outlined"
          secureTextEntry
          error={!!errors.password}
        />
        <HelperText type="error" visible={!!errors.password}>
          {errors.password}
        </HelperText>

        <View style={styles.qrCodeContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.qrCodeButton,
              pressed && styles.qrCodeButtonPressed,
            ]}
            onPress={handleQRCodeNavigation}
          >
            <Text style={styles.qrCodeButtonText}>Connect with QR Code</Text>
          </Pressable>
        </View>

        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleSubmit}
        >
          <Animated.View
            style={[
              styles.button,
              {
                transform: [{ scale: animation }],
              },
            ]}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  scrollViewContent: {
    flexGrow: 1,
    padding: 10,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  lapaganaLogo: {
    width: 200,
    height: 250,
  },

  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FF0040",
    paddingVertical: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  qrCodeContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  qrCodeText: {
    fontSize: 16,
  },
  qrCodeButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  qrCodeButtonPressed: {
    backgroundColor: "#1976D2",
  },
  qrCodeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
});
