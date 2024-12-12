import { useState, useEffect } from "react";

import { View, StyleSheet } from "react-native";
import { expense, sales, total } from "@/constants/types";
import { getStatement } from "@/helper/statements";
import MetricCardSkeleton from "../skeleton/MetricCardSkeleton";
import { getSession } from "@/helper/session";
import MetricCard from "./MetricCard";
export default function SummaryCards() {
  const [sales, setSales] = useState<sales>();
  const [expense, setExpense] = useState<expense>();
  const [total, setTotal] = useState<total>();
  const [isLoading, setIsLoading] = useState(false);
  const pieData = [
    {
      name: "Seoul",
      population: 21500000,
      color: "#22c55e",
      legendFontColor: "#7F7F7F",
    },
    {
      name: "Toronto",
      population: 2800000,
      color: "#64748b",
      legendFontColor: "#7F7F7F",
    },
  ];

  useEffect(() => {
    const data = async () => {
      try {
        const session = await getSession();
        console.log(session);
        setIsLoading(true);
        const statement = await getStatement();
        setSales(statement.sales);
        setExpense(statement.expense);
        setTotal(statement.total);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    data();
  }, []);

  return (
    <View>
      {isLoading ? (
        <View>
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </View>
      ) : (
        <View>
          <View>
            <MetricCard
              type="sales"
              title="Monthly Sales"
              amount={`₱${sales?.currenMonthSales.toLocaleString()}`}
              change={
                sales?.trends == "Infinity" || null
                  ? 0
                  : Number(sales?.trends) || 0
              }
            />
          </View>

          <View>
            <MetricCard
              type="expense"
              title="Monthly Expenses"
              amount={`₱${expense?.currenMonthExpense.toLocaleString()}`}
              change={
                expense?.trends == "Infinity" || null
                  ? 0
                  : Number(expense?.trends) || 0
              }
            />
          </View>

          <View>
            <MetricCard
              type="income"
              title="Monthly Income"
              amount={`₱${total?.total.toLocaleString()}`}
              change={
                total?.trends == "Infinity" || null || "-Infinity"
                  ? 0
                  : Number(total?.trends) || 0
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  salesIMG: {
    height: 100,
    width: 100,
  },
});
