import { Header } from "@/src/components/header";
import { SideMenu } from "@/src/components/sidemenu";
import { getExpensesByMonth } from "@/src/service/api";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { CadastroDespesa } from "./cadastroDespesa";

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export default function Despesas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "yyyy-MM"),
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, [currentMonth]);

  async function loadExpenses() {
    setLoading(true);

    const response = await getExpensesByMonth(currentMonth);
    if (response.success) {
      setExpenses(response.data);
    }
    setLoading(false);
  }

  const expensesOfDay = useMemo(() => {
    return expenses.filter((exp) => exp.date === selectedDate);
  }, [expenses, selectedDate]);

  const totalOfDay = useMemo(() => {
    return expensesOfDay.reduce((acc, item) => acc + item.amount, 0);
  }, [expensesOfDay]);

  const markedDates = useMemo(() => {
    const marks: any = {};

    expenses.forEach((expense) => {
      marks[expense.date] = { marked: true };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: "#000",
    };

    return marks;
  }, [expenses, selectedDate]);

  return (
    <>
      <Header headerTxt={"Despesas"} onMenuPress={() => setMenuOpen(true)} />
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
            <View style={styles.calendarWrapper}>
              <Calendar
                current={selectedDate}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                onMonthChange={(month) => {
                  setCurrentMonth(
                    `${month.year}-${String(month.month).padStart(2, "0")}`,
                  );
                }}
                markedDates={markedDates}
                theme={{
                  selectedDayBackgroundColor: "#000",
                  arrowColor: "#FF8A00",
                  todayTextColor: "#000",
                  textDayFontSize: 14,
                  textMonthFontSize: 20,
                  textMonthFontWeight: "700",
                  todayDotColor: "#FF8A00",
                  dotColor: "#FF8A00",
                }}
                hideExtraDays
              />
            </View>

            <Text style={styles.sectionTitle}>Despesas do dia</Text>

            {loading ? (
              <Text style={styles.loading}>Carregando...</Text>
            ) : (
              <FlatList
                data={expensesOfDay}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={styles.itemTitle}>{item.description}</Text>
                    <Text style={styles.itemValue}>
                      R$ {item.amount.toFixed(2).replace(".", ",")}
                    </Text>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.empty}>Nenhuma despesa neste dia</Text>
                }
              />
            )}

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setVisible(true)}
              >
                <Text style={styles.addText}>+</Text>
              </TouchableOpacity>

              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total do dia:</Text>
                <Text style={styles.totalValue}>
                  R$ {totalOfDay.toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </View>

            <Modal
              visible={visible}
              transparent
              animationType="fade"
              onRequestClose={() => setVisible(false)}
            >
              <View style={{ flex: 1, padding: 20 }}>
                <CadastroDespesa />
              </View>

              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </Modal>
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
  },
  container: {
    flexGrow: 1,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: "#eeee",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  calendarWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginTop: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 20,
  },
  loading: {
    textAlign: "center",
    marginTop: 16,
  },
  empty: {
    textAlign: "center",
    marginTop: 16,
    color: "#777",
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#b4b4b4",
  },
  itemTitle: {
    fontSize: 15,
  },
  itemValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "#FF8A00",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  addText: {
    fontSize: 30,
    color: "#fff",
    marginTop: -8,
  },
  totalBox: {
    flex: 1,
    backgroundColor: "#000000d2",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: "#fff",
    fontSize: 16,
  },
  totalValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },

  closeButton: {},
});
