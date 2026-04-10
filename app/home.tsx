import { Button } from "@/src/components/button";
import { Header } from "@/src/components/header";
import { SideMenu } from "@/src/components/sidemenu";
import { getDailyExpenses, getRecentExpenses } from "@/src/service/api";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface ExpenseData {
  date: string;
  amount: number;
}

interface RecentExpense {
  id: string;
  description: string;
  amount: number;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<RecentExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const result = await getDailyExpenses();
      if (result.success) {
        setExpenses(result.data);
      }

      const recentResult = await getRecentExpenses();
      if (recentResult.success) {
        setRecentExpenses(recentResult.data);
      }

      setLoading(false);
    };
    fetchExpenses();
  }, []);

  const processData = () => {
    const labels: string[] = [];
    const data: number[] = [];
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      date.setDate(date.getDate() + 1); // Ajuste de 1 dia para corrigir o deslocamento
      const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" });
      labels.push(dayName);
      data.push(expense.amount);
    });
    return { labels, datasets: [{ data }] };
  };

  const chartData = processData();

  const handleDespesas = () => {
    // setMenuOpen(false);
    // Navegar para a tela de despesas (ex.: router.push('/despesas'))
    router.push("/despesas");
  };

  return (
    <>
      <Header headerTxt={"Home"} onMenuPress={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <View style={styles.wrapper}>
        <LinearGradient
          colors={["#fff500", "#f28f09", "#f6c23d", "#c7922d"]}
          style={styles.gradientBorder}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  marginBottom: 5,
                }}
              >
                Total gasto no mês{" "}
              </Text>
              {/* Aqui tem que ser o valor gasto no mês, puxado da api */}
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "800",
                  color: "#1F2937",
                }}
              >
                R$ 1.250,00
              </Text>
            </View>
            {!loading && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Gastos dos últimos dias</Text>

                <LineChart
                  data={chartData}
                  width={Dimensions.get("window").width - 80}
                  height={220}
                  yAxisLabel="R$ "
                  chartConfig={{
                    backgroundColor: "transparent",
                    backgroundGradientFrom: "transparent",
                    backgroundGradientTo: "transparent",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 138, 0, ${opacity})`,
                    labelColor: () => "#51555f",
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: "#FF8A00",
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: "",
                      stroke: "#e5e7eb95",
                    },
                  }}
                  bezier
                  style={{
                    marginTop: 8,
                  }}
                />
              </View>
            )}
            <View style={styles.card2}>
              <Text style={styles.chartTitle}>Confira seus últimos gastos</Text>

              {recentExpenses.map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                  <Text style={styles.expenseDescription}>
                    {expense.description}
                  </Text>

                  <Text style={styles.expenseValue}>
                    R$ {expense.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
            <Button label="Nova Despesa" onPress={handleDespesas}></Button>
          </ScrollView>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  gradientBorder: {
    padding: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flex: 1,
    width: "100%",
    marginTop: -28,
    zIndex: 1,
  },

  container: {
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#eeee",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "flex-start",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  chartContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  chartCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#ffffffed",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 20,
  },

  card2: {
    backgroundColor: "#ffffffed",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 20,
  },

  expenseItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  expenseDescription: {
    fontSize: 15,
    color: "#1F2937",
    flex: 1,
  },

  expenseValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF8A00",
  },
});

// criar um card de valor gasto no mês
// criar um gráfico?
// criar um card de ultimos gastos
// criar botão de nova despesa
