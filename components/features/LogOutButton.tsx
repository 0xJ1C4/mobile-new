import { Button } from "react-native-paper";
import { removeSession } from "@/helper/session";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function LogOutButton() {
  const router = useRouter();

  const handleSubmit = async () => {
    await removeSession();
    router.replace("/LogForm");
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Button
        icon={"logout"}
        style={{
          width: 150,
          justifyContent: "center",
          alignContent: "center",
        }}
        buttonColor="red"
        mode="contained"
        onPress={() => {
          handleSubmit();
        }}
      >
        Logout
      </Button>
    </View>
  );
}
