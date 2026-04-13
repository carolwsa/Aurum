import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import { createExpense } from "@/src/service/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CreateExpensePayload {
  description: string;
  amount: number;
  category: string;
  type: "despesa" | "meta" | string;
  date: string;
  recurring: boolean;
}

export const CadastroDespesa = () => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("alimentacao");
  const [tipo, setTipo] = useState("despesa");
  const [date, setDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [recorrente, setRecorrente] = useState(false);

  function onChange(_: any, selectedDate?: Date) {
    setShow(false);
    if (selectedDate) setDate(selectedDate);
  }

  async function handleSalvar() {
    if (!descricao || !valor || !date) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const payload: CreateExpensePayload = {
      description: descricao,
      amount: Number(valor),
      category: categoria,
      type: tipo,
      date: date.toISOString(),
      recurring: recorrente,
    };

    const response = await createExpense(payload);

    if (response.success) {
      alert(response.message);

      setDescricao("");
      setValor("");
      setDate(null);
      setRecorrente(false);
    } else {
      alert(response.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Cadastrar Despesa</Text>

        <Input
          style={styles.despesa}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Input
          style={styles.despesa}
          placeholder="Valor"
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
        />

        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>

          <View>
            <Picker
              selectedValue={categoria}
              onValueChange={setCategoria}
              style={styles.picker}
              dropdownIconColor="#666"
            >
              <Picker.Item
                label="Alimentação"
                value="alimentacao"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Habitação"
                value="habitacao"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Transporte"
                value="transporte"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Saúde"
                value="saude"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Educação"
                value="educacao"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Comunicação"
                value="comunicacao"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Streaming"
                value="streaming"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Lazer"
                value="lazer"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Outros"
                value="outros"
                style={styles.pickerItem}
              />
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data</Text>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>
              {date ? date.toLocaleDateString("pt-BR") : "Selecionar data"}
            </Text>
          </TouchableOpacity>

          {show && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
            />
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tipo</Text>
          <View>
            <Picker
              selectedValue={tipo}
              onValueChange={setTipo}
              style={styles.picker}
            >
              <Picker.Item
                label="Despesa"
                value="despesa"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Meta"
                value="meta"
                style={styles.pickerItem}
              />
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setRecorrente(!recorrente)}
          style={styles.checkboxContainer}
        >
          <View style={[styles.checkbox, recorrente && styles.checkboxChecked]}>
            {recorrente && <Text style={styles.check}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Despesa recorrente</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button label="Salvar" onPress={handleSalvar} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },

  modal: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#000000",
  },

  field: {
    gap: 7,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  picker: {
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },

  pickerItem: {
    fontSize: 14,
    color: "#000000",
  },

  dateButton: {
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },

  dateText: {
    fontSize: 14,
    color: "#000000",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#8e8f8f",
    borderRadius: 6,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },

  checkboxChecked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },

  check: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  checkboxLabel: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },

  buttonContainer: {
    marginTop: 5,
    alignItems: "center",
  },

  despesa: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    color: "#000000",
    paddingHorizontal: 12,
    borderRadius: 6,
    width: "100%",
    height: 44,
    fontSize: 14,
  },
});
