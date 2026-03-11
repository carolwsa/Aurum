import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Texto } from "../components/text";

export default function Login() {
  return (
    <LinearGradient
      colors={["#fff500", "#f28f09", "#f6c23d", "#c7922d"]}
      style={styles.gradientBorder}
    >
      <View style={styles.container}>
        <View style={styles.container_inputs}>
          <Texto id={"1"} textContent="Login" />
          <Input placeholder="E-mail" />
          <Input placeholder="Senha" secureTextEntry={true} />
        </View>

        <Button label={"Entrar"} />
        <View style={styles.container_buttons}>
          <Texto id={"2"} textContent="Não possui conta?" />
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Montserrat",
              marginTop: 20,
              fontWeight: "bold",
            }}
          >
            Cadastre-se
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    flex: 1,
    padding: 3,
    margin: 25,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#eeee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  container_inputs: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container_buttons: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
});
