import { Button } from "@/src/components/button";
import { Header } from "@/src/components/header";
import { SideMenu } from "@/src/components/sidemenu";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Perfil() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados para os dados do usuário (inicialmente vazios ou mockados)
  const [usuario, setUsuario] = useState({
    nome: "Ana Carolina",
    email: "ana.silva@gmail.com",
  });

  // Estado temporário para a modal (evita salvar sem confirmar)
  const [tempNome, setTempNome] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const handleOpenEdit = () => {
    setTempNome(usuario.nome);
    setTempEmail(usuario.email);
    setModalVisible(true);
  };

  const handleSave = () => {
    // Aqui fazer o await api.put('/user', { nome: tempNome, email: tempEmail })
    setUsuario({ nome: tempNome, email: tempEmail });
    setModalVisible(false);
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => console.log("Logout realizado") }, // Aqui lógica de limpar token/redirecionar
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header headerTxt={"Meu Perfil"} onMenuPress={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <View style={styles.wrapper}>
        <LinearGradient
          colors={["#fff500", "#f28f09", "#f6c23d", "#c7922d"]}
          style={styles.gradientBorder}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profileHeader}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../src/assets/images/profile.png")}
                  style={styles.iconImage}
                />
              </View>
              <Text style={styles.userName}>{usuario.nome}</Text>
              <Text style={styles.userEmail}>{usuario.email}</Text>
            </View>

            <View style={styles.actionCard}>
              <Text style={styles.cardTitle}>Configurações da Conta</Text>
              <View style={styles.buttonGap}>
                <Button label="Editar Perfil" onPress={handleOpenEdit} />
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutText}>Sair da Conta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Informações</Text>

            <Text style={styles.inputLabel}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={tempNome}
              onChangeText={setTempNome}
              placeholder="Digite seu nome"
            />

            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={tempEmail}
              onChangeText={setTempEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Digite seu e-mail"
            />

            <View style={styles.modalFooter}>
              <Button
                label="Cancelar"
                id="cancel"
                onPress={() => setModalVisible(false)}
              />
              <Button label="Salvar" id="save" onPress={handleSave} />
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
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  gradientBorder: {
    flex: 1,
    padding: 1,
    marginTop: -28,
    paddingTop: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
  },
  container: {
    paddingTop: 30,
    paddingHorizontal: 25,
    paddingBottom: 40,
    backgroundColor: "#eeee",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: "100%",
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 30,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 15,
  },
  iconImage: {
    width: 60,
    height: 60,
    tintColor: "#4B5563",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  actionCard: {
    backgroundColor: "#FFF",
    width: "100%",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonGap: {
    gap: 8,
    alignItems: "center",
  },
  logoutBtn: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 16,
  },

  /* Modal Styles */
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
    elevation: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 30,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#374151",
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
