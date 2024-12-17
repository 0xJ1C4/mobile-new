import NoReceiptTransactionForm from "@/components/features/Forms/NoReceiptTransactionForm";
import { useLocalSearchParams } from "expo-router";
import ReceiptTransactionForm from "@/components/features/Forms/ReceiptTransactionForm";
import ReceiptTransactionFormTest from "@/components/features/Forms/ReceipTransactionFormTest";
import { View } from "react-native";
import React from "react";
export default function EditTransaction() {
  const params = useLocalSearchParams();

  const { type } = params;
  return (
    <>
      {type == "receipt" ? (
        <ReceiptTransactionFormTest />
      ) : (
        <NoReceiptTransactionForm />
      )}
    </>
  );
}
