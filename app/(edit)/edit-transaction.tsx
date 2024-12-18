import NoReceiptTransactionForm from "@/components/features/Forms/NoReceiptTransactionForm";
import { useLocalSearchParams } from "expo-router";
import ReceiptTransactionFormTest from "@/components/features/Forms/ReceipTransactionFormTest";
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
