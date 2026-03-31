import { Header } from "@/src/components/header";
import { SideMenu } from "@/src/components/sidemenu";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Perfil() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Header
        headerTxt={"Configurações"}
        onMenuPress={() => setMenuOpen(true)}
      />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Meu Perfil</Text>
      </View>
    </>
  );
}
