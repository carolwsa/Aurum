import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  label: string;
};

export const Button = ({ label, ...rest }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.6} {...rest}>
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
});
