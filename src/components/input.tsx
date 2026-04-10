import { StyleSheet, TextInput, TextInputProps } from "react-native";

export const Input = ({ ...rest }: TextInputProps) => {
  //O "...rest" é para passar todas as props do TextInput para o componente Input, sem precisar especificar cada uma delas.
  //Assim, o componente Input pode ser usado de forma flexível,
  //permitindo que o usuário passe qualquer prop que seja válida para um TextInput.
  return <TextInput style={styles.input} {...rest}></TextInput>;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#8d8d8d",
    color: "#000000",
    padding: 17,
    borderRadius: 50,
    margin: 5,
    width: "85%",
    fontSize: 16,
  },
});
