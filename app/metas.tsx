import { Button } from "@/src/components/button";
import { Header } from "@/src/components/header";
import { Input } from "@/src/components/input";
import { SideMenu } from "@/src/components/sidemenu";
import { getAllExpenses } from "@/src/service/api";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Metas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [metaParaEditar, setMetaParaEditar] = useState({
    nome: "Comprar Casa",
    valorTotal: 50000,
  });

  const [valoresPagosPorMes, setValoresPagosPorMes] = useState<{
    [key: string]: number;
  }>({});

  const valorTotalMeta = 50000;
  const parcelaMensal = 4166.67;

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    async function sincronizarDados() {
      const response = await getAllExpenses();

      if (response.success) {
        const lancamentosMeta = response.data.filter(
          (item: any) => item.type === "meta",
        );

        const somaPorMes: { [key: string]: number } = {};

        lancamentosMeta.forEach((item: any) => {
          const data = new Date(item.date);
          const nomeMes = months[data.getUTCMonth()];

          somaPorMes[nomeMes] =
            (somaPorMes[nomeMes] || 0) + Number(item.amount);
        });

        setValoresPagosPorMes(somaPorMes);
      }
    }
    sincronizarDados();
  }, []);

  const totalPagoGeral = useMemo(() => {
    return Object.values(valoresPagosPorMes).reduce((acc, val) => acc + val, 0);
  }, [valoresPagosPorMes]);

  const valorPendenteTotal = valorTotalMeta - totalPagoGeral;

  const mesesQuitadosCount = useMemo(() => {
    return Object.values(valoresPagosPorMes).filter(
      (valor) => valor >= parcelaMensal,
    ).length;
  }, [valoresPagosPorMes]);

  return (
    <View>
      <Header headerTxt={"Metas"} onMenuPress={() => setMenuOpen(true)} />
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
              <View style={styles.headerCard}>
                <View style={styles.titleCard}>
                  <Text style={styles.labelMeta}>Comprar Casa</Text>
                </View>

                <View>
                  <TouchableOpacity onPress={() => setEditModalOpen(true)}>
                    <Image
                      source={require("../src/assets/images/editIcon.png")}
                      style={styles.iconImage}
                    ></Image>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.valorPrincipal}>
                {valorTotalMeta.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Ainda faltam pagar:</Text>
              <Text style={[styles.valorSecundario, { color: "#E11D48" }]}>
                {valorPendenteTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
              <Text style={styles.subtext}>
                {mesesQuitadosCount} de 12 meses quitados
              </Text>
            </View>

            <View style={styles.checkboxGroup}>
              {months.map((month) => {
                const pagoNoMes = valoresPagosPorMes[month] || 0;
                const isPaid = pagoNoMes >= parcelaMensal;
                const isParcial = pagoNoMes > 0 && pagoNoMes < parcelaMensal;

                return (
                  <View
                    key={month}
                    style={[
                      styles.checkboxRow,
                      isPaid && styles.rowPaid,
                      isParcial && styles.rowPartial,
                    ]}
                  >
                    <View style={styles.rowTop}>
                      <View
                        style={[
                          styles.checkbox,
                          isPaid && styles.checkboxChecked,
                        ]}
                      >
                        {isPaid && <Text style={styles.checkMark}>✓</Text>}
                      </View>
                      <Text
                        style={[
                          styles.checkboxLabel,
                          isPaid && styles.labelPaid,
                        ]}
                      >
                        {month}
                      </Text>
                    </View>

                    <Text style={styles.valorMesText}>
                      {pagoNoMes.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>

      <Modal
        visible={editModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Meta</Text>

            <Text style={styles.label}>Descrição</Text>
            <Input
              style={styles.input}
              placeholder="Ex: Comprar carro, Reserva de Emergência..."
              value={metaParaEditar.nome}
              onChangeText={(txt) =>
                setMetaParaEditar({ ...metaParaEditar, nome: txt })
              }
            />
            <Text style={styles.label}>Valor</Text>
            <Input
              style={styles.input}
              placeholder="Inisra o valor da meta"
              value={String(metaParaEditar.valorTotal)}
              onChangeText={(txt) =>
                setMetaParaEditar({
                  ...metaParaEditar,
                  valorTotal: Number(txt),
                })
              }
            />

            <View style={styles.modalButtons}>
              <Button
                id="cancel"
                onPress={() => setEditModalOpen(false)}
                label="Cancelar"
              ></Button>
              <Button
                id="save"
                onPress={() =>
                  // Aqui você chamaria sua API de Update
                  setEditModalOpen(false)
                }
                label="Salvar"
              ></Button>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 1,
    paddingTop: 2,
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

  labelMeta: { fontSize: 14, color: "#6B7280", marginBottom: 5 },
  valorPrincipal: { fontSize: 32, fontWeight: "800", color: "#1F2937" },
  label: { fontSize: 14, color: "#6B7280" },
  valorSecundario: { fontSize: 28, fontWeight: "800" },
  subtext: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },

  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  checkboxRow: {
    backgroundColor: "#FFF",
    width: "48%",
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },

  rowTop: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  rowPaid: { borderColor: "#10B981", backgroundColor: "#F0FDF4" },
  rowPartial: { borderColor: "#F59E0B", backgroundColor: "#FFFBEB" },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 5,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#10B981", borderColor: "#10B981" },
  checkMark: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  checkboxLabel: { fontSize: 14, color: "#4B5563", fontWeight: "700" },
  labelPaid: { color: "#065F46" },

  valorMesText: { fontSize: 11, color: "#6B7280", fontWeight: "600" },

  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  titleCard: {
    width: "100%",
    alignItems: "center",
  },
  iconImage: {
    width: 26,
    height: 26,
    resizeMode: "contain",
    tintColor: "#000000",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
