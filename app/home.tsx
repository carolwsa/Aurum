import { Header } from "@/src/components/header";
import { SideMenu } from "@/src/components/sidemenu";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Header headerTxt={"Home"} onMenuPress={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Bem-vindo à Home!
        </Text>
      </View>
    </>
  );
}

// criar um menu?
// criar um card de valor gasto no mês
// criar um gráfico?
// criar um card de ultimos gastos
// criar botão de nova despesa
