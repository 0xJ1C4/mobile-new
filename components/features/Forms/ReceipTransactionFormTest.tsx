import React, { SetStateAction, useEffect, useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "@/constants/theme";
import { DatePickerInput } from "react-native-paper-dates";
import { TextInput, Button, Text, IconButton } from "react-native-paper";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import { patchReceiptContent, getReceiptContentById } from "@/helper/receipt";
import { ReceiptData } from "@/constants/types";
import TransactionFormLoading from "@/components/skeleton/TransactionFormSkeleton";
import { getExpenseCategories, getSaleCategories } from "@/helper/categories";

const validationSchema = Yup.object().shape({
  receipt_number: Yup.string().required("Receipt number is required"),
  date: Yup.date().required("Date is required"),
  delivered_by: Yup.string().required("Delivered by is required"),
  delivered_to: Yup.string().required("Delivered to is required"),
  address: Yup.string().required("Address is required"),
  receipt_type: Yup.string().required("Receipt type is required"),
  total: Yup.string().required("Total is required"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().required("Description is required"),
        unit_price: Yup.string().required("Unit price is required"),
        amount: Yup.string().required("Amount is required"),
      })
    )
    .required("At least one item is required"),
});

const calculateTotal = (items: any) => {
  return items
    .reduce((sum: any, item: any) => sum + parseFloat(item.amount), 0)
    .toFixed(2);
};

type Category = {
  id: number;
  name: string;
  description: string;
};

export default function ReceiptTransactionFormTest() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const {
    id,
    receipt_number,
    receipt_type,
    delivered_by,
    delivered_to,
    address,
    total,
    date,
  } = useLocalSearchParams();

  const initialDate = typeof date === "string" ? new Date(date) : undefined;

  //receipt category
  const [expenseCategory, setExpenseCategory] = useState<Category[]>();
  const [salesCategory, setSalesCategory] = useState<Category[]>();
  useEffect(() => {
    const getCategories = async () => {
      const expenseCategoryRequest = await getExpenseCategories();
      const salesCategoryRequest = await getSaleCategories();

      setExpenseCategory(await expenseCategoryRequest);
      setSalesCategory(await salesCategoryRequest);
    };

    getCategories();
  }, []);

  //Select List
  const [selected, setSelected] = useState(receipt_type as string);
  const selectData = [
    { key: "Sales", value: "Sales" },
    { key: "Expense", value: "Expense" },
  ];

  //handle Submit Form
  const handleSubmitForm = async (body: any) => {
    const dateInManila = new Date(body.date);
    dateInManila.setHours(dateInManila.getHours() + 8);

    const formattedDate = dateInManila.toISOString().split("T")[0];

    const data = {
      ...body,
      id: Number(body.id),
      date: formattedDate,
      receipt_type: selected,
      items: body.items,
      total: Number(body.total),
      expense_category: selected === "Expense" ? body.expense_category : null,
      sales_category: selected === "Sales" ? body.sales_category : null,
    };

    const req = await patchReceiptContent(data);

    if (req?.ok) {
      Alert.alert("Success", "Receipt has been updated");
      router.dismiss();
    } else {
      Alert.alert("Failed", "Receipt has not been updated");
      router.dismiss();
    }
  };

  // getData from the server using ID
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const content = await getReceiptContentById(id as string);
        setReceiptData(content);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Failed to fetch receipt data");
      }
    };
    fetchReceipt();
  }, [id]);

  if (!receiptData) {
    return (
      <SafeAreaView style={styles.container}>
        <TransactionFormLoading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          id: id,
          receipt_number: receiptData?.receipt_number,
          delivered_by: receiptData?.delivered_by,
          delivered_to: receiptData?.delivered_to,
          address: receiptData?.address,
          total: receiptData?.total,
          date: initialDate,
          items: receiptData?.items || [],
          receipt_type: receiptData?.receipt_type || "",
          receipt_category: receiptData?.receipt_category || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
          isSubmitting,
          touched,
          errors,
        }) => (
          <KeyboardAvoidingView
            style={styles.formContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView>
              <Text style={styles.title}>Edit Receipt Transaction Form</Text>

              <TextInput
                label="Receipt Number"
                onChangeText={handleChange("receipt_number")}
                onBlur={handleBlur("receipt_number")}
                value={values.receipt_number}
                mode="outlined"
                style={styles.input}
                error={touched.receipt_number && !!errors.receipt_number}
              />
              {touched.receipt_number && errors.receipt_number && (
                <Text style={styles.errorText}>{errors.receipt_number}</Text>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Receipt Type</Text>
                <SelectList
                  setSelected={(val: SetStateAction<string>) => {
                    setSelected(val as string);
                    setFieldValue("receipt_type", val);
                    setFieldValue("receipt_category", "");
                  }}
                  data={selectData}
                  save="value"
                  defaultOption={{ key: receipt_type, value: receipt_type }}
                  placeholder="Select Receipt Type"
                />
              </View>
              {touched.receipt_type && errors.receipt_type && (
                <Text style={styles.errorText}>{errors.receipt_type}</Text>
              )}

              {(selected === "Expense" || selected === "Sales") && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Receipt Category</Text>
                  <SelectList
                    setSelected={(val: string) => {
                      setFieldValue(
                        selected == "Expense"
                          ? "expense_category"
                          : "sales_category",
                        Number(val)
                      );
                    }}
                    data={
                      selected === "Expense"
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
                      values.receipt_category
                        ? {
                            key: values.receipt_category,
                            value: values.receipt_category,
                          }
                        : undefined
                    }
                    placeholder="Select Receipt Category"
                  />
                </View>
              )}

              <TextInput
                label="Delivered By"
                onChangeText={handleChange("delivered_by")}
                onBlur={handleBlur("delivered_by")}
                value={values.delivered_by}
                mode="outlined"
                style={styles.input}
                error={touched.delivered_by && !!errors.delivered_by}
              />
              {touched.delivered_by && errors.delivered_by && (
                <Text style={styles.errorText}>{errors.delivered_by}</Text>
              )}

              <TextInput
                label="Delivered To"
                onChangeText={handleChange("delivered_to")}
                onBlur={handleBlur("delivered_to")}
                value={values.delivered_to}
                mode="outlined"
                style={styles.input}
                error={touched.delivered_to && !!errors.delivered_to}
              />
              {touched.delivered_to && errors.delivered_to && (
                <Text style={styles.errorText}>{errors.delivered_to}</Text>
              )}

              <TextInput
                label="Address"
                multiline
                numberOfLines={4}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
                mode="outlined"
                style={styles.input}
                error={touched.address && !!errors.address}
              />
              {touched.address && errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}

              <DatePickerInput
                locale="en"
                label="Transaction Date"
                value={values.date}
                onChange={(d) => setFieldValue("date", d)}
                inputMode="start"
                mode="outlined"
                style={styles.input}
              />

              {/* Items */}
              <View style={{ marginTop: 20 }}>
                <Text style={styles.subtitle}>Items</Text>
                {values.items &&
                  values.items.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <TextInput
                        label="Description"
                        onChangeText={handleChange(
                          `items[${index}].description`
                        )}
                        onBlur={handleBlur(`items[${index}].description`)}
                        value={item.description}
                        mode="outlined"
                        style={styles.input}
                      />
                      <TextInput
                        label="Unit Price"
                        value={String(item.unit_price)}
                        mode="outlined"
                        disabled
                        style={styles.input}
                        keyboardType="numeric"
                        editable={false}
                      />
                      <TextInput
                        label="Amount"
                        onChangeText={(value) => {
                          handleChange(`items[${index}].amount`)(value);
                          const newItems = [...values.items];
                          newItems[index].amount = value;
                          setFieldValue("items", newItems);
                          setFieldValue("total", calculateTotal(newItems));
                        }}
                        onBlur={handleBlur(`items[${index}].amount`)}
                        value={String(item.amount)}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                      />
                    </View>
                  ))}

                <TextInput
                  label="Total"
                  value={String(values.total)}
                  mode="outlined"
                  style={styles.input}
                  error={touched.total && !!errors.total}
                  editable={false}
                />
                {touched.total && errors.total && (
                  <Text style={styles.errorText}>{errors.total}</Text>
                )}
              </View>

              {/* Submit Button */}
              <Button
                onPress={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                mode="contained"
                style={styles.button}
                labelStyle={styles.buttonLabel}
                loading={isSubmitting}
                // icon={"send"}
              >
                Update Transaction
              </Button>

              {/* Cancel Button */}
              <Button
                onPress={() => {
                  router.replace("/(tabs)/transaction");
                }}
                mode="contained"
                style={styles.button}
                buttonColor="red"
                labelStyle={styles.buttonLabel}
                // icon={"cancel"}
              >
                Cancel Transaction
              </Button>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.colors.primary,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemContainer: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 4,
  },
  addItemButton: {
    marginBottom: 16,
  },
  deleteButton: {
    alignSelf: "flex-end",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
});
