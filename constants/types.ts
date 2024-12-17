export type sales = {
    previousMonthCount: number,
    previousMonthSales: number,
    currentMonthCount: number,
    currenMonthSales: number,
    trends: string
}

export type expense = {
    previousMonthCount: number,
    previousMonthExpense: number,
    currentMonthCount: number,
    currenMonthExpense: number,
    trends: string
}

export type total = {
    total: number,
    trends: string
}


export type ReceiptItem = {
    description: string;
    unit_price: string;
    amount: string;
  };
  
export type ReceiptData = {
    receipt_category: any
    receipt_number: string;
    date: Date;
    delivered_by: string;
    delivered_to: string;
    address: string;
    receipt_type: string;
    items: ReceiptItem[];
    total: string;
    image: string,
    imageFile: File
  }| null; 
  