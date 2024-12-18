import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import ExpenseTable from "@/components/features/ExpenseTable";
import SaleTable from "@/components/features/SaleTable";
import { useCallback, useState } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function NoReceiptTransactionView() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  //scroll refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/** no receipt table */}
        <View>
          <View style={{ alignItems: "center" }}>
            <SaleTable />
          </View>

          <View style={{ alignItems: "center", marginBottom: 100 }}>
            <ExpenseTable />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.actionButton}
          onPress={() =>
            router.push({
              pathname: "/(edit)/add-transaction",
              params: {
                type: "sales",
              },
            })
          }
        >
          Add Sales
        </Button>
        <Button
          mode="contained"
          style={styles.actionButton}
          buttonColor="red"
          onPress={() =>
            router.push({
              pathname: "/(edit)/add-transaction",
              params: {
                type: "expense",
              },
            })
          }
        >
          Add Expense
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  actionButton: {
    width: "40%", // Adjust button width
    borderRadius: 8,
  },
  buttonContainer: {
    position: "absolute", // Floats above other elements
    bottom: 20, // Adjust to place it above the bottom navigation
    width: "100%", // Full width
    flexDirection: "row", // Horizontal layout for buttons
    justifyContent: "space-evenly", // Even spacing between buttons
    alignItems: "center",
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
