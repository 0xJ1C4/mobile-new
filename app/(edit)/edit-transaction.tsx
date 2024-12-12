import NoReceiptTransactionForm from "@/components/features/Forms/NoReceiptTransactionForm";
import { useLocalSearchParams } from "expo-router";
import ReceiptTransactionForm from "@/components/features/Forms/ReceiptTransactionForm";
import ReceiptTransactionFormTest from "@/components/features/Forms/ReceipTransactionFormTest";
import { View } from "react-native";
export default function EditTransaction() {
  const params = useLocalSearchParams();

  const { type } = params;
  return (
    <View>
      {type == "receipt" ? (
        <ReceiptTransactionFormTest />
      ) : (
        <NoReceiptTransactionForm />
      )}
    </View>
  );
}
