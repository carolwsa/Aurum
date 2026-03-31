import { StyleSheet, Text } from "react-native";

interface TextoProps {
  id: string;
  textContent: string;
}

export const Texto = ({ id, textContent }: TextoProps) => {
  return (
    <Text
      style={
        id === "1"
          ? styles.titulo
          : id === "2"
            ? styles.legenda
            : id === "3"
              ? styles.subtitulo
              : styles.Tbody
      }
    >
      {textContent}
    </Text>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    textAlign: "center",
    marginBottom: 50,
    marginTop: 20,
  },
  legenda: {
    fontSize: 16,
    fontFamily: "Montserrat",
    textAlign: "left",
    marginTop: 20,
    color: "#3a3a3a",
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    textAlign: "center",
    color: "#3a3a3a",
  },
  Tbody: {},
});
