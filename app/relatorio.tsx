import { Header } from "@/src/components/header";
import { SideMenu } from "@/src/components/sidemenu";
import { getAllExpenses } from "@/src/service/api";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Relatorio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dadosApi, setDadosApi] = useState<any[]>([]);

  const categoriasFixas = [
    "Alimentação",
    "Habitação",
    "Transporte",
    "Saúde",
    "Lazer",
  ];

  useEffect(() => {
    async function carregarDados() {
      const response = await getAllExpenses();
      if (response.success) {
        setDadosApi(response.data);
      }
    }
    carregarDados();
  }, []);

  // Lógica de Datas
  const dataAtual = new Date();
  const mesAtualNome = dataAtual.toLocaleString("pt-BR", { month: "long" });
  const anoAtual = dataAtual.getFullYear();
  const chartWidth = Math.max(screenWidth - 80, 280);

  // Processamento dos Dados
  const stats = useMemo(() => {
    const hoje = new Date();
    let totalMes = 0;
    let totalAno = 0;

    const gastosPorCategoria: { [key: string]: number } = {
      Alimentação: 800,
      Habitação: 1000,
      Transporte: 500,
      Saúde: 170,
      Lazer: 1200,
    };

    dadosApi.forEach((item) => {
      const dataItem = new Date(item.date);
      const valor = Number(item.amount);

      if (dataItem.getUTCFullYear() === hoje.getUTCFullYear()) {
        totalAno += valor;
        if (dataItem.getUTCMonth() === hoje.getUTCMonth()) {
          totalMes += valor;
          if (gastosPorCategoria.hasOwnProperty(item.category)) {
            gastosPorCategoria[item.category] += valor;
          }
        }
      }
    });

    const coresCategorias: Record<string, string> = {
      Alimentação: "#aabed6", // laranja pastel claro
      Habitação: "#f28f09", // laranja nude
      Transporte: "#c0c3c7", // amarelo suave
      Saúde: "#f49241", // amarelo âmbar claro
      Lazer: "#8793a2d8",
    };

    // Formatação para a biblioteca: labels (X) e datasets (Y)
    const chartData = {
      labels: ["Alim.", "Hab.", "Transp.", "Saúde", "Lazer"], // Abreviei para caber melhor na tela

      datasets: [
        {
          data: categoriasFixas.map((cat) => gastosPorCategoria[cat]),
          colors: categoriasFixas.map((cat) => () => coresCategorias[cat]),
        },
      ],
    };

    return { totalMes, totalAno, chartData };
  }, [dadosApi]);

  // Configuração de estilo do gráfico
  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",

    color: () => "#3e3e3e53",
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, // cinza moderno

    strokeWidth: 0,
    barPercentage: 0.9,
    decimalPlaces: 0,

    propsForLabels: {
      fontSize: 12,
    },

    propsForVerticalLabels: {
      fontWeight: "600",
    },

    propsForBackgroundLines: {
      stroke: "#E5E7EB",
      strokeDasharray: "4",
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header headerTxt={"Relatório"} onMenuPress={() => setMenuOpen(true)} />
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
              <View style={styles.headerRow}>
                <Text style={styles.label}>Total gasto em {mesAtualNome}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Mensal</Text>
                </View>
              </View>

              <Text style={styles.value}>
                {stats.totalMes.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>

            <View style={[styles.card, styles.cardSecondary]}>
              <Text style={styles.label}>Acumulado de {anoAtual}</Text>
              <Text style={styles.valueSmall}>
                {stats.totalAno.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
            <View style={styles.graphCard}>
              <Text style={styles.graphTitle}>Gastos por categoria</Text>
              <Text
                style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}
              >
                Visão geral do mês atual
              </Text>

              <BarChart
                data={stats.chartData}
                width={chartWidth}
                height={300}
                yAxisLabel="R$ "
                yAxisSuffix=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                fromZero={true}
                withCustomBarColorFromData
                showValuesOnTopOfBars={false}
                flatColor
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
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
    flex: 1,
    padding: 1,
    marginTop: -28,
    paddingTop: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
  },
  container: {
    paddingTop: 30,
    paddingHorizontal: 25,
    paddingBottom: 40,
    backgroundColor: "#eeee",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: "100%",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 24,
    width: "100%",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6", // Borda sutil para definir o card
  },
  cardSecondary: {
    marginTop: 12,
    backgroundColor: "#FFFFFF", // Diferencia levemente o card anual do mensal
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -1,
  },
  valueSmall: {
    fontSize: 24,
    fontWeight: "800",
    color: "#374151",
  },
  badge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#10B981",
    fontSize: 10,
    fontWeight: "700",
  },
  graphCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 24,
    width: "100%",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    alignItems: "center",
    marginVertical: 20,
    paddingTop: 50,
    paddingRight: 45,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
});
