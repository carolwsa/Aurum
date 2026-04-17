import { useRouter } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const SideMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();

  const menuItems = [
    { label: "Home", route: "/home" },
    { label: "Metas", route: "/metas" },
    { label: "Despesas", route: "/despesas" },
    { label: "Relatório", route: "/relatorio" },
    { label: "Configurações", route: "/perfil" },
  ];

  const handleNavigate = (route: string) => {
    router.push(route as any);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.transparentArea} onPress={onClose} />

        <View style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.menuContent}>
            {menuItems.map((item) => (
              <Pressable
                key={item.route}
                style={({ hovered, pressed }: any) => [
                  styles.menuItem,
                  (hovered || pressed) && styles.menuItemHovered,
                ]}
                onPress={() => handleNavigate(item.route)}
              >
                {({ hovered, pressed }: any) => (
                  <Text
                    style={[
                      styles.menuItemText,
                      (hovered || pressed) && styles.menuItemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // Invertemos para 'row-reverse' para que o menuContainer
    // fique na esquerda e a transparentArea na direita
    flexDirection: "row",
    backgroundColor: "rgba(17, 24, 39, 0.7)", // Backdrop mais denso e profissional
  },
  transparentArea: {
    flex: 1,
  },
  menuContainer: {
    width: "75%",
    backgroundColor: "#FFFFFF",
    height: "100%",
    paddingTop: 60,
    // Sombra sutil projetada para a direita
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    borderRightWidth: 1,
    borderRightColor: "#F3F4F6",
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 30,
    // Removi a borda inferior para um visual mais limpo e contínuo
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "300", // Mais fino = mais elegante
    color: "#111827",
    letterSpacing: 4, // Estilo "Luxury" para o nome AURUM
    textTransform: "uppercase",
  },
  closeButton: {
    fontSize: 18,
    color: "#9CA3AF",
    fontWeight: "300",
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  menuItem: {
    paddingVertical: 25,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
    borderLeftColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
  },
  menuItemActive: {
    backgroundColor: "#F9FAFB",
    borderLeftColor: "#D4AF37", // A LINHA DOURADA (Aurum)
  },
  menuItemText: {
    fontSize: 19,
    color: "#4B5563",
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  menuItemTextActive: {
    color: "#111827",
    fontWeight: "600",
  },
  menuItemHovered: {
    backgroundColor: "#F9FBFD", // Um azul/cinza bem clarinho
    borderLeftColor: "#D4AF37", // A linha dourada Aurum
  },
});
