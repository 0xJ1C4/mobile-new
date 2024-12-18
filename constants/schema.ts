import * as Yup from 'yup';


export const ReceiptTransactionSchema = Yup.object().shape({
  id: Yup.number().required("ID is required"),
  date: Yup.date().required('Date is required'),
  receipt_number: Yup.number().required("Receipt number is required"),
  receipt_type: Yup.string().required("Receipt type is required"),
  delivered_by: Yup.string().required("Delivered by is required"),
  delivered_to: Yup.string().required("Delivered to is required"),
  address: Yup.string().required("Address is required"),
  total: Yup.number().required("Total is required"),
})

export type ReceiptTransactionSchemaDataType = Yup.InferType<typeof ReceiptTransactionSchema>;


export const SaleTransactionSchema = Yup.object().shape({
    id: Yup.number().required("ID is required"),
    date: Yup.date().required('Date is required'),
    category: Yup.number().required("ID is required"),
    description: Yup.string().required("Description is required"),
    amount: Yup.number()
      .required("Amount is required")
      .min(0, "Amount must be positive"),
  });

export const AddTransactionSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    category: Yup.number().required("ID is required"),
    description: Yup.string().required("Description is required"),
    amount: Yup.number()
      .required("Amount is required")
      .min(0, "Amount must be positive"),
  });

export type AddTransactionFormDataType = Yup.InferType<typeof AddTransactionSchema>;


export type TransactionFormDataType = Yup.InferType<typeof SaleTransactionSchema>;
