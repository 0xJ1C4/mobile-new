import {
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SummaryCards from "@/components/features/SummaryCard";
import { ScrollView } from "react-native";
import { useCallback, useState, useEffect } from "react";
import { getUser, removeSession } from "@/helper/session";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";
import Chart from "@/components/features/SalesExpensePieChart";
import ReceiptTable from "@/components/features/ReceiptTable";
import LogOutButton from "@/components/features/LogOutButton";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  //check session
  useEffect(() => {
    const request = async () => {
      try {
        setLoading(true);
        const user = await getUser();
      } catch (error) {
        await removeSession();
        router.replace("/");
      }
    };
    request();
    setLoading(false);
  }, []);

  //for refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.headerText}>DASHBOARD</Text>
          <View style={{ margin: 20 }}>
            <SummaryCards />
          </View>
          <View>
            <Chart />
          </View>

          <View style={{ padding: 5 }}>
            <Text variant="labelLarge">
              Recent Transactions ( With Receipt )
            </Text>
            <ReceiptTable />
          </View>

          <View style={{ alignItems: "center" }}>
            <LogOutButton />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    padding: 5,
    marginLeft: 10,
    color: "#17202A",
    fontSize: 36,
    fontWeight: "bold",
  },
});
