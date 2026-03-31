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
    { label: "Despesas", route: "/despesas" },
    { label: "Relatório", route: "/relatorio" },
    { label: "Metas", route: "/metas" },
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
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
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
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  transparentArea: {
    flex: 1,
  },
  menuContainer: {
    width: "75%",
    backgroundColor: "#ffffff",
    height: "100%",
    paddingTop: 40,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 10,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    color: "#333",
  },
  closeButton: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  menuContent: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: "Montserrat",
    color: "#333",
    fontWeight: "500",
  },
});
