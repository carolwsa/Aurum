import { Feedback } from "@/src/components/feedback";
import { useAuth } from "@/src/context/auth";
import { login, register } from "@/src/service/api";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../src/components/button";
import { Input } from "../src/components/input";
import { Texto } from "../src/components/text";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nome, setNome] = useState("");

  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const { isLoggedIn, user, checkAuth } = useAuth();

  const handleCadastro = async () => {
    if (!nome || !email || !password || !confirmPassword) {
      setFeedback({
        type: "error",
        message: "Preencha todos os campos.",
      });

      return;
    }

    if (password.length < 10) {
      setFeedback({
        type: "error",
        message: "A senha deve possuir no mínimo 10 caracteres.",
      });

      return;
    }

    if (password !== confirmPassword) {
      setFeedback({
        type: "error",
        message: "As senhas não coincidem.",
      });
      return;
    }

    setLoading(true);

    const cadastro = await register(nome, email, password);
    if (!cadastro.success) {
      setLoading(false);
      setFeedback({
        type: "error",
        message: "Erro no cadastro.",
      });
      console.log(cadastro.message);
      return;
    }

    const loginResult = await login(email, password);

    if (loginResult.success) {
      setFeedback({
        type: "success",
        message: "Cadastro realizado com sucesso!",
      });

      await checkAuth();
      setLoading(false);

      router.push("/home");
    } else {
      setFeedback({
        type: "error",
        message: "Erro ao recuperar as informações.",
      });
      console.log(loginResult.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#fff500", "#f28f09", "#f6c23d", "#c7922d"]}
        style={styles.gradientBorder}
      >
        <View style={styles.container}>
          <View style={styles.container_inputs}>
            <Texto id={"1"} textContent="Cadastro" />
            <Input placeholder="Nome" value={nome} onChangeText={setNome} />
            <Input placeholder="E-mail" value={email} onChangeText={setEmail} />
            <Input
              placeholder="Senha"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <Input
              placeholder="Confime a senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
          </View>

          <Button
            label={loading ? "Carregando..." : "Entrar"}
            onPress={handleCadastro}
            disabled={loading}
          />

          {feedback && (
            <Feedback type={feedback.type} message={feedback.message} />
          )}

          <View style={styles.container_buttons}>
            <Texto id={"2"} textContent="Já possui conta?" />
            <Text
              style={{
                fontSize: 16,
                marginTop: 20,
                fontWeight: "bold",
              }}
            >
              <Link href="./">Login</Link>
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
    height: "85%",
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
