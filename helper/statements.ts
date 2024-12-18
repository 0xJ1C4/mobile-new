import { NEXT_API_URL } from "@/constants/api";
import { getSession } from "./session";
import { getCurrentMonthRange } from "./current-month";

export const getStatement = async () => {
  const session = await getSession();

  const req = await fetch(`${NEXT_API_URL}/api/total/month`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${session}`
    },
    cache: 'no-store'
  });

  if (req.ok) {
    const data = await req.json();
    return data;
  }
};

export const getMonthlyTransactionReceipt = async () => {
    const session = await getSession();

    const { from, to } = getCurrentMonthRange();

    const req = await fetch(`${NEXT_API_URL}/api/receipt?type=All&from=${from}&to=${to}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${session}`
        },
        cache: 'no-store'
      });
    
      if (req.ok) {
        const data = await req.json();
        return data;
      }
}


export const getMonthlyStatement = async () => {
    const session = await getSession();


    const req = await fetch(`${NEXT_API_URL}/api/total/month`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${session}`
        },
        cache: 'no-store'
      });
    
      if (req.ok) {
        const data = await req.json();
        return data;
      }
}

export const getMonthlyNoReceiptExpense = async () => {
    const session = await getSession();

    const { from, to } = getCurrentMonthRange();

    const req = await fetch(`${NEXT_API_URL}/api/expense?date=${from}&second=${to}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${session}`
        },
        cache: 'no-store'
      });
    
      if (req.ok) {
        const data = await req.json();
        return data;
      }
}

export const getMonthlyNoReceiptSale = async () => {
    const session = await getSession();

    const { from, to } = getCurrentMonthRange();

    const req = await fetch(`${NEXT_API_URL}/api/sales?date=${from}&second=${to}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${session}`
        },
        cache: 'no-store'
      });
    
      if (req.ok) {
        const data = await req.json();
        return data;
      }
}