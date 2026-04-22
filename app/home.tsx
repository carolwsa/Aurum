import { Button } from "@/src/components/button";
import { Header } from "@/src/components/header";
import { SideMenu } from "@/src/components/sidemenu";
import {
  getDespesasDoMesAtual,
  getDespesasParaGrafico,
  getUltimas5Despesas,
} from "@/src/service/api";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

interface ExpenseData {
  date: string;
  amount: number;
}

interface RecentExpense {
  id: string;
  titulo: string;
  valor: number;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [recentExpenses, setRecentExpenses] = useState<RecentExpense[]>([]);
  const [chartExpenses, setChartExpenses] = useState<ExpenseData[]>([]);
  const [totalMes, setTotalMes] = useState(0);
  const [loading, setLoading] = useState(true);

  const hasChartData = chartExpenses.length > 0;
  const hasRecentExpenses = recentExpenses.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const mesResult = await getDespesasDoMesAtual();
      if (mesResult.success) {
        setTotalMes(mesResult.totalGasto);
      }

      const chartResult = await getDespesasParaGrafico();
      if (chartResult.success) {
        setChartExpenses(chartResult.data);
      }

      const lastResult = await getUltimas5Despesas();
      if (lastResult.success) {
        setRecentExpenses(lastResult.despesas);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const processData = () => {
    if (chartExpenses.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }

    const labels: string[] = [];
    const data: number[] = [];

    chartExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const dayName = date.toLocaleDateString("pt-BR", {
        weekday: "short",
      });

      labels.push(dayName);
      data.push(expense.amount);
    });

    return { labels, datasets: [{ data }] };
  };

  const chartData = processData();

  const handleDespesas = () => {
    // setMenuOpen(false);

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
                R$ {totalMes.toFixed(2).replace(".", ",")}
              </Text>
            </View>

            <View>
              {loading && <ActivityIndicator size="small" color="#f28f09" />}
            </View>

            {!loading && !hasChartData && !hasRecentExpenses && (
              <View style={styles.card}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#1F2937",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  Bem-vindo ao Aurum!
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: "#6B7280",
                    textAlign: "center",
                  }}
                >
                  Você ainda não possui despesas cadastradas.
                </Text>
              </View>
            )}
            {!loading && hasChartData && (
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

            {!loading && hasRecentExpenses && (
              <View style={styles.card2}>
                <Text style={styles.chartTitle}>
                  Confira seus últimos gastos
                </Text>

                {recentExpenses.map((expense) => (
                  <View key={expense.id} style={styles.expenseItem}>
                    <Text style={styles.expenseDescription}>
                      {expense.titulo}
                    </Text>

                    <Text style={styles.expenseValue}>
                      R$ {expense.valor.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
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
    flex: 1,
    width: "100%",
    marginTop: -28,
  },

  container: {
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#eeee",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: "100%",
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
    marginBottom: 20,
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
