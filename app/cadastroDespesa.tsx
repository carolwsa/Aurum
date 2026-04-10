import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

export const CadastroDespesa = () => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [value, setValue] = useState("alimentacao");
  const [date, setDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  function onChange(event: any, selectedDate?: Date) {
    setShow(false);

    if (selectedDate) {
      setDate(selectedDate);
    }
  }

  return (
    <View>
      <Input
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Input
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      <View>
        <Text>Categoria</Text>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => setValue(itemValue)}
        >
          <Picker.Item label="Alimentação" value="alimentacao" />
          <Picker.Item label="Habitação" value="habitação" />
          <Picker.Item label="Transporte" value="transporte" />
          <Picker.Item label="Saúde" value="saúde" />
          <Picker.Item label="Educação" value="educação" />
          <Picker.Item label="Comunicação" value="comunicacao" />
          <Picker.Item label="Streaming" value="streaming" />
          <Picker.Item label="Lazer" value="lazer" />
          <Picker.Item label="Outros" value="outros" />
        </Picker>
      </View>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 12,
            borderRadius: 6,
          }}
        >
          <Text>
            {date ? date.toLocaleDateString("pt-BR") : "Selecione uma data"}
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
      <View>
        <Text>Tipo</Text>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => setValue(itemValue)}
        >
          <Picker.Item label="Despesa" value="despesa" />
          <Picker.Item label="Meta" value="meta" />
        </Picker>
      </View>
      <TouchableOpacity
        onPress={() => setChecked(!checked)}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderWidth: 2,
            borderColor: "#333",
            borderRadius: 4,
            marginRight: 8,
            backgroundColor: checked ? "#4CAF50" : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {checked && <Text style={{ color: "#fff" }}>✓</Text>}
        </View>

        <Text>Despesa Recorrente</Text>
      </TouchableOpacity>

      <Button label="Salvar" onPress={() => {}} />
    </View>
  );
};
