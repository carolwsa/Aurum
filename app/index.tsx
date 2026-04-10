import { useAuth } from "@/src/context/auth";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "../src/components/button";
import { Input } from "../src/components/input";
import { Texto } from "../src/components/text";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    console.log("Login solicitado com:", { email, password });

    // setLoading(true);
    // const result = await login(email, password);
    // setLoading(false);

    // if (result.success) {
    //   Alert.alert("Sucesso", result.message);
    //   // Navegue para a tela principal (ex.: router.push('/dashboard'))
    // } else {
    //   Alert.alert("Erro", result.message);
    // }

    router.push("/home");
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#fff500", "#f28f09", "#f6c23d", "#c7922d"]}
        style={styles.gradientBorder}
      >
        <View style={styles.container}>
          <View style={styles.container_inputs}>
            <Texto id={"1"} textContent="Login" />
            <Input placeholder="E-mail" value={email} onChangeText={setEmail} />
            <Input
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <Button label={"Entrar"} onPress={handleLogin} disabled={loading} />
          <View style={styles.container_buttons}>
            <Texto id={"2"} textContent="Não possui conta?" />
            <Text
              style={{
                fontSize: 16,
                marginTop: 20,
                fontWeight: "bold",
              }}
            >
              {/* @ts-ignore */}
              <Link href="/cadastro">Cadastre-se</Link>
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBorder: {
    padding: 3,
    borderRadius: 10,
    height: "70%",
    width: "90%",
  },
  container: {
    flex: 1,
    padding: 20,
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
    justifyContent: "center",
    width: "80%",
    gap: 10,
  },
});
