import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  label: string;
};

export const Button = ({ id, label, ...rest }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={
        id == "cancel"
          ? styles.cancelBtn
          : id == "save"
            ? styles.saveBtn
            : styles.container
      }
      activeOpacity={0.6}
      {...rest}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "84%",
    height: 50,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 30,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelBtn: {
    width: "45%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginVertical: 16,
    backgroundColor: "#c44646",
  },
  saveBtn: {
    width: "45%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginVertical: 16,
    backgroundColor: "#2a9a75",
  },
});
