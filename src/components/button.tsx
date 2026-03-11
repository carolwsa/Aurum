import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Texto } from "./text";

type ButtonProps = TouchableOpacityProps & {
  label: string;
};

export const Button = ({ label, ...rest }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.6} {...rest}>
      <Texto id={"3"} textContent={label} />
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
});
