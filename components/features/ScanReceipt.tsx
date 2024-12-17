import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SelectList } from "react-native-dropdown-select-list";
import { useRouter } from "expo-router";
import { useReceipt } from "@/provider/ReceiptProvider";
import { saveReceiptContent, uploadImageReceipt } from "@/helper/receipt";
import LoadingIndicator from "../ui/LoadingIndicator";
import { getExpenseCategories, getSaleCategories } from "@/helper/categories";

type Category = {
  id: number;
  name: string;
  description: string;
};

export default function EditReceipt() {
  const router = useRouter();
  const { receiptData, setReceiptData } = useReceipt();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedType, setSelectedType] = useState(
    receiptData?.receipt_type || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const [items, setItems] = useState(receiptData?.items || []);
  const [total, setTotal] = useState(receiptData?.total || "0");

  //get categories
  const [expenseCategory, setExpenseCategory] = useState<Category[]>();
  const [salesCategory, setSalesCategory] = useState<Category[]>();

  const data = [
    { key: "1", value: "Sales" },
    { key: "2", value: "Expense" },
  ];

  // Recalculate the total whenever items change
  useEffect(() => {
    const updatedTotal = items.reduce((sum, item) => {
      const unitPrice = parseFloat(item.unit_price) || 0;
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
    setTotal(updatedTotal.toLocaleString());
  }, [items]);

  useEffect(() => {
    const getCategories = async () => {
      const expenseCategoryRequest = await getExpenseCategories();
      const salesCategoryRequest = await getSaleCategories();

      setExpenseCategory(await expenseCategoryRequest);
      setSalesCategory(await salesCategoryRequest);
    };

    getCategories();
  }, []);

  const handleInputChange = (field: string, value: string | Date | any) => {
    if (setReceiptData && receiptData) {
      if (field === "items" && Array.isArray(value)) {
        setReceiptData({
          ...receiptData,
          items: value,
        });
        setItems(value); // Update local state for items
      } else {
        setReceiptData({
          ...receiptData,
          [field]: value,
        });
      }
    }
  };

  if (!receiptData) {
    return (
      <View style={styles.container}>
        <Text>No receipt data available. Please scan a receipt.</Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.content}>
            <Text style={styles.title}>EDIT RECEIPT</Text>

            <View style={styles.formGrid}>
              {/* Receipt Number */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Receipt Number</Text>
                <TextInput
                  style={styles.input}
                  value={receiptData.receipt_number}
                  onChangeText={(text) =>
                    handleInputChange("receipt_number", text)
                  }
                />
              </View>

              {/* Date */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                >
                  <Text>
                    {receiptData.date
                      ? new Date(receiptData.date).toLocaleDateString()
                      : "Select Date"}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={
                      receiptData.date ? new Date() : new Date(receiptData.date)
                    }
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        handleInputChange("date", selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              {/* Delivered By */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Delivered By</Text>
                <TextInput
                  style={styles.input}
                  value={receiptData.delivered_by}
                  onChangeText={(text) =>
                    handleInputChange("delivered_by", text)
                  }
                />
              </View>

              {/* Delivered To */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Delivered To</Text>
                <TextInput
                  style={styles.input}
                  value={receiptData.delivered_to}
                  onChangeText={(text) =>
                    handleInputChange("delivered_to", text)
                  }
                />
              </View>

              {/* Address */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  multiline
                  style={styles.input}
                  value={receiptData.address}
                  onChangeText={(text) => handleInputChange("address", text)}
                />
              </View>

              {/* Receipt Type */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Receipt Type</Text>
                <SelectList
                  setSelected={(val: string) => {
                    setSelectedType(val);
                    handleInputChange("receipt_type", val);
                    // Clear the receipt_category when changing receipt_type
                    handleInputChange("receipt_category", "");
                  }}
                  data={data}
                  save="value"
                  defaultOption={{
                    key: receiptData.receipt_type || "",
                    value: receiptData.receipt_type || "",
                  }}
                />
              </View>

              {/* Receipt Category */}
              {(selectedType === "Expense" || selectedType === "Sales") && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Receipt Category</Text>
                  <SelectList
                    setSelected={(val: string) => {
                      handleInputChange(
                        selectedType == "Expense"
                          ? "expense_category"
                          : "sales_category",
                        val
                      );
                    }}
                    data={
                      selectedType === "Expense"
                        ? expenseCategory?.map((item) => ({
                            key: item.id.toString(),
                            value: item.name,
                          })) || []
                        : salesCategory?.map((item) => ({
                            key: item.id.toString(),
                            value: item.name,
                          })) || []
                    }
                    save="key"
                    defaultOption={
                      receiptData.receipt_category
                        ? {
                            key: receiptData.receipt_category,
                            value: receiptData.receipt_category,
                          }
                        : undefined
                    }
                  />
                </View>
              )}
            </View>

            {/* Items Table */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.descriptionCol]}>
                Description
              </Text>
              <Text style={[styles.headerText, styles.priceCol]}>
                Unit Price
              </Text>
              <Text style={[styles.headerText, styles.amountCol]}>Amount</Text>
            </View>
            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <TextInput
                  style={[styles.tableInput, styles.descriptionCol]}
                  value={item.description}
                  onChangeText={(text) => {
                    const updatedItems = [...items];
                    updatedItems[index] = {
                      ...updatedItems[index],
                      description: text,
                    };
                    handleInputChange("items", updatedItems); // Pass the updated array
                  }}
                />
                <TextInput
                  style={[styles.tableInput, styles.priceCol]}
                  value={item.unit_price}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedItems = [...items];
                    updatedItems[index] = {
                      ...updatedItems[index],
                      unit_price: text,
                    };
                    handleInputChange("items", updatedItems);
                  }}
                />
                <TextInput
                  style={[styles.tableInput, styles.amountCol]}
                  value={item.amount}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedItems = [...items];
                    updatedItems[index] = {
                      ...updatedItems[index],
                      amount: text,
                    };
                    handleInputChange("items", updatedItems);
                  }}
                />
              </View>
            ))}

            {/* Editable Total */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <TextInput
                style={styles.totalInput}
                value={total}
                keyboardType="numeric"
                onChangeText={(text) => setTotal(text)} // Directly edit total
              />
            </View>

            {/* Save and Cancel Buttons */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={async () => {
                try {
                  const uploadImage = await uploadImageReceipt(
                    receiptData.imageFile
                  );

                  if (uploadImage?.ok) {
                    const uploadedImage = await uploadImage.json();
                    const uuid = uploadedImage?.id;

                    const transformedData = {
                      ...receiptData,
                      image: "",
                      items: receiptData.items.map((item: any) => ({
                        ...item,
                        unit_price: Number(item.unit_price),
                        amount: Number(item.amount),
                      })),
                      total: Number(receiptData.total),
                      receipt_type: selectedType,
                      date: new Date(receiptData.date)
                        .toISOString()
                        .split("T")[0],
                      image_uuid: uuid,
                    };
                    setIsLoading(true);
                    await saveReceiptContent(transformedData);
                    setIsLoading(false);
                    router.dismiss();
                  }
                } catch (error) {
                  Alert.alert("An Error occured");
                }
              }}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                router.back();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel or Re-scan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  formGrid: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  tableInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  descriptionCol: {
    flex: 2,
    marginRight: 8,
  },
  priceCol: {
    flex: 1,
    marginRight: 8,
  },
  amountCol: {
    flex: 1,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 12,
  },
  totalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    width: 120,
    textAlign: "right",
  },
  saveButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
});
