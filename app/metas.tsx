import { Button } from "@/src/components/button";
import { Feedback } from "@/src/components/feedback";
import { Header } from "@/src/components/header";
import { Input } from "@/src/components/input";
import { SideMenu } from "@/src/components/sidemenu";
import {
  adicionarValorAcumulado,
  createMeta,
  getHistoricoMeta,
  getMetas,
  updateMeta,
} from "@/src/service/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Meta = {
  id: string;
  nome: string;
  valorTotal: number;
  valorAcumulado: number;
  mesesTotais: number;
  valorMensal: number;
  dataInicio: string;
  dataFinal: string;
};

type MesParcela = {
  mes: number;
  ano: number;
  label: string;
};

export default function Metas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [semMetas, setSemMetas] = useState(false);
  const [metaAtiva, setMetaAtiva] = useState<Meta | null>(null);
  const [valoresPagosPorMes, setValoresPagosPorMes] = useState<
    Record<string, number>
  >({});
  const [saving, setSaving] = useState(false);
  const [parcelasEmPagamento, setParcelasEmPagamento] = useState<Set<string>>(
    new Set(),
  );
  const [formTitulo, setFormTitulo] = useState("");
  const [formValor, setFormValor] = useState("");
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFinal, setDataFinal] = useState<Date | null>(null);
  const [pickerTarget, setPickerTarget] = useState<"inicio" | "final" | null>(
    null,
  );
  const [mesesMarcados, setMesesMarcados] = useState<Set<string>>(new Set());

  const isEditing = !!metaAtiva;

  const gerarMesesEntreDatas = (
    inicioISO: string,
    fimISO: string,
  ): MesParcela[] => {
    const [anoInicio, mesInicio] = inicioISO.split("-").map(Number);
    const [anoFim, mesFim] = fimISO.split("-").map(Number);

    const meses: MesParcela[] = [];
    let ano = anoInicio;
    let mes = mesInicio;

    while (ano < anoFim || (ano === anoFim && mes <= mesFim)) {
      const date = new Date(ano, mes - 1, 1);

      meses.push({
        mes,
        ano,
        label: date.toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
      });

      mes++;
      if (mes > 12) {
        mes = 1;
        ano++;
      }
    }

    return meses;
  };

  const openCreateModal = () => {
    setFormTitulo("");
    setFormValor("");
    setDataInicio(null);
    setDataFinal(null);
    setFeedback(null);

    setEditModalOpen(true);
  };

  const openEditModal = () => {
    if (!metaAtiva) return;

    setFormTitulo(metaAtiva.nome);
    setFormValor(String(metaAtiva.valorTotal));
    setDataInicio(new Date(metaAtiva.dataInicio));
    setDataFinal(new Date(metaAtiva.dataFinal));

    setFeedback(null);

    setEditModalOpen(true);
  };

  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const sincronizarDados = async () => {
    setSaving(true);

    const metasResponse = await getMetas();
    if (!metasResponse.success || metasResponse.data.length === 0) {
      setSemMetas(true);
      setMetaAtiva(null);
      setSaving(false);
      return;
    }

    const meta = metasResponse.data[0];

    const historicoResponse = await getHistoricoMeta(meta.id);

    setMetaAtiva({
      id: meta.id,
      nome: meta.titulo,
      valorTotal: Number(meta.valor),
      valorAcumulado: Number(meta.valorAcumulado),
      mesesTotais: Number(meta.mesesTotais),
      valorMensal: Number(meta.valorMensalInicial),
      dataInicio: meta.dataInicio,
      dataFinal: meta.dataFinal,
    });

    setValoresPagosPorMes(
      historicoResponse.success
        ? Object.fromEntries(
            historicoResponse.historicoMensal.map((h: any) => [
              `${h.ano}-${String(h.mes).padStart(2, "0")}`,
              Number(h.totalDeposito),
            ]),
          )
        : {},
    );

    setSemMetas(false);
    setSaving(false);
  };

  useEffect(() => {
    sincronizarDados();
  }, []);

  const handleSalvar = async () => {
    setFeedback(null);

    if (!formTitulo || !formValor) {
      setFeedback({
        type: "error",
        message: "Preencha o título e o valor da meta.",
      });
      return;
    }

    if (!isEditing) {
      if (!dataInicio || !dataFinal) {
        setFeedback({
          type: "error",
          message: "Selecione a data inicial e final.",
        });
        return;
      }

      if (dataFinal <= dataInicio) {
        setFeedback({
          type: "error",
          message: "A data final deve ser posterior à data inicial.",
        });
        return;
      }
    }

    setSaving(true);

    if (isEditing && metaAtiva) {
      const result = await updateMeta(metaAtiva.id, {
        titulo: formTitulo,
        valor: Number(formValor),
        dataInicio: dataInicio!.toISOString().slice(0, 10),
        dataFinal: dataFinal!.toISOString().slice(0, 10),
      });

      if (result.success) {
        setMetaAtiva({
          ...metaAtiva,
          nome: formTitulo,
          valorTotal: Number(formValor),
          dataInicio: dataInicio!.toISOString(),
          dataFinal: dataFinal!.toISOString(),
        });

        setFeedback({
          type: "success",
          message: "Meta atualizada com sucesso!",
        });

        setTimeout(() => setEditModalOpen(false), 1200);
      } else {
        setFeedback({
          type: "error",
          message: result.message || "Erro ao atualizar meta.",
        });
      }
    } else {
      const result = await createMeta({
        titulo: formTitulo,
        valor: Number(formValor),
        dataInicio: dataInicio!.toISOString().slice(0, 10),
        dataFinal: dataFinal!.toISOString().slice(0, 10),
      });

      if (result.success) {
        setFeedback({
          type: "success",
          message: "Meta criada com sucesso!",
        });

        await sincronizarDados();

        setTimeout(() => setEditModalOpen(false), 1200);
      } else {
        setFeedback({
          type: "error",
          message: result.message || "Erro ao criar meta.",
        });
      }
    }

    setSaving(false);
  };

  const handlePagarParcela = async (mes: number, ano: number) => {
    if (!metaAtiva) return;

    const chave = `${ano}-${String(mes).padStart(2, "0")}`;

    // ✅ feedback visual imediato
    setMesesMarcados((prev) => new Set(prev).add(chave));
    setParcelasEmPagamento((prev) => new Set(prev).add(chave));

    const totalPagoNoMes = valoresPagosPorMes[chave] || 0;
    const valorParcela = metaAtiva.valorTotal / parcelas.length;
    const valorFaltante = valorParcela - totalPagoNoMes;

    if (valorFaltante <= 0) return;

    try {
      await adicionarValorAcumulado(metaAtiva.id, valorFaltante);
      await sincronizarDados();
    } finally {
      setParcelasEmPagamento((prev) => {
        const novo = new Set(prev);
        novo.delete(chave);
        return novo;
      });
    }
  };

  const valorPendenteTotal = useMemo(() => {
    if (!metaAtiva) return 0;
    return Math.max(metaAtiva.valorTotal - metaAtiva.valorAcumulado, 0);
  }, [metaAtiva]);

  const parcelas = useMemo(() => {
    if (!metaAtiva) return [];

    return gerarMesesEntreDatas(metaAtiva.dataInicio, metaAtiva.dataFinal);
  }, [metaAtiva?.dataInicio, metaAtiva?.dataFinal]);

  const mesesQuitadosCount = useMemo(() => {
    if (!metaAtiva) return 0;

    const valorParcela = metaAtiva.valorTotal / parcelas.length;

    return parcelas.filter((p) => {
      const chave = `${p.ano}-${String(p.mes).padStart(2, "0")}`;
      return (
        (valoresPagosPorMes[chave] || 0) >= valorParcela ||
        mesesMarcados.has(chave)
      );
    }).length;
  }, [parcelas, valoresPagosPorMes, metaAtiva, mesesMarcados]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header headerTxt="Metas" onMenuPress={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <View style={styles.wrapper}>
        <LinearGradient
          colors={["#fff500", "#f28f09", "#f6c23d", "#c7922d"]}
          style={styles.gradientBorder}
        >
          <ScrollView contentContainerStyle={styles.container}>
            {saving && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F59E0B" />
                <Text style={styles.loadingText}>Carregando metas...</Text>
              </View>
            )}

            {!saving && semMetas && (
              <View style={[styles.card, styles.emptyCard]}>
                <Text style={styles.emptyTitle}>
                  Você ainda não possui metas cadastradas
                </Text>

                <Text style={styles.emptySubtitle}>
                  Crie uma meta para acompanhar seu progresso financeiro.
                </Text>

                <Button label="Nova Meta" onPress={openCreateModal} />
              </View>
            )}

            {!saving && !semMetas && metaAtiva && (
              <>
                <View style={styles.card}>
                  <View style={styles.headerCard}>
                    <Text style={styles.labelMeta}>{metaAtiva.nome}</Text>

                    <TouchableOpacity onPress={openEditModal}>
                      <Image
                        source={require("../src/assets/images/editIcon.png")}
                        style={styles.iconImage}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.valorPrincipal}>
                    {metaAtiva.valorTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.label}>Ainda falta pagar:</Text>

                  <Text style={[styles.valorSecundario, { color: "#E11D48" }]}>
                    {valorPendenteTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>

                  <Text style={styles.subtext}>
                    {mesesQuitadosCount} de {parcelas.length} meses quitados
                  </Text>
                </View>

                <View style={styles.checkboxGroup}>
                  {parcelas.map((p) => {
                    const chave = `${p.ano}-${String(p.mes).padStart(2, "0")}`;
                    const totalPagoNoMes = valoresPagosPorMes[chave] || 0;
                    const valorParcela = metaAtiva.valorTotal / parcelas.length;

                    const isPaid =
                      totalPagoNoMes >= valorParcela ||
                      mesesMarcados.has(chave);

                    return (
                      <View
                        key={chave}
                        style={[styles.checkboxRow, isPaid && styles.rowPaid]}
                      >
                        <View style={styles.rowTop}>
                          <TouchableOpacity
                            style={[
                              styles.checkbox,
                              isPaid && styles.checkboxChecked,
                            ]}
                            disabled={parcelasEmPagamento.has(chave) || isPaid}
                            onPress={() => handlePagarParcela(p.mes, p.ano)}
                          >
                            {isPaid && <Text style={styles.checkMark}>✓</Text>}
                          </TouchableOpacity>

                          <Text
                            style={[
                              styles.checkboxLabel,
                              isPaid && styles.labelPaid,
                            ]}
                          >
                            {p.label}
                          </Text>
                        </View>

                        <Text style={styles.valorMesText}>
                          {valorParcela.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </ScrollView>
        </LinearGradient>
      </View>

      <Modal visible={editModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Editar Meta" : "Nova Meta"}
            </Text>

            <Text style={styles.label}>Descrição</Text>
            <Input
              style={styles.input}
              value={formTitulo}
              onChangeText={setFormTitulo}
            />

            <Text style={styles.label}>Valor</Text>
            <Input
              style={styles.input}
              keyboardType="numeric"
              value={formValor}
              onChangeText={setFormValor}
            />

            <Text style={styles.label}>Data início</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setPickerTarget("inicio")}
            >
              <Text>
                {dataInicio
                  ? dataInicio.toLocaleDateString("pt-BR")
                  : "Selecionar"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Data final</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setPickerTarget("final")}
            >
              <Text>
                {dataFinal
                  ? dataFinal.toLocaleDateString("pt-BR")
                  : "Selecionar"}
              </Text>
            </TouchableOpacity>

            {pickerTarget && (
              <DateTimePicker
                value={
                  pickerTarget === "inicio"
                    ? (dataInicio ?? new Date())
                    : (dataFinal ?? new Date())
                }
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={(_, selectedDate) => {
                  if (!selectedDate) return;
                  pickerTarget === "inicio"
                    ? setDataInicio(selectedDate)
                    : setDataFinal(selectedDate);
                  setPickerTarget(null);
                }}
              />
            )}

            {feedback && (
              <Feedback type={feedback.type} message={feedback.message} />
            )}

            <View style={styles.modalButtons}>
              <Button
                id="cancel"
                label="Cancelar"
                onPress={() => setEditModalOpen(false)}
              />

              <Button id="save" label={"Salvar"} onPress={handleSalvar} />
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
    alignItems: "center",
  },
  gradientBorder: {
    flex: 1,
    width: "100%",
    padding: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -28,
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#eeee",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: "100%",
  },
  card: {
    backgroundColor: "#ffffffed",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  labelMeta: { fontSize: 14, color: "#6B7280" },
  valorPrincipal: { fontSize: 32, fontWeight: "800", color: "#1F2937" },
  label: { fontSize: 14, color: "#6B7280" },
  valorSecundario: { fontSize: 28, fontWeight: "800" },
  subtext: { fontSize: 12, color: "#9CA3AF" },

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
  },
  rowTop: { flexDirection: "row", alignItems: "center" },
  rowPaid: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
  },
  rowPartial: {
    borderColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
  },
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
  checkboxLabel: { fontSize: 14, fontWeight: "700" },
  labelPaid: { color: "#065F46" },
  valorMesText: { fontSize: 11, marginTop: 4 },

  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  iconImage: { width: 26, height: 26, resizeMode: "contain" },

  selectorButton: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
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
    borderRadius: 25,
    padding: 25,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  emptyCard: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: "#1F2937",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
  },
  loadingContainer: {
    flex: 1,
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
});
