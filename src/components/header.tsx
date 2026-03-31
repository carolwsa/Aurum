import { Image, Pressable, StyleSheet, View } from "react-native";
import { Texto } from "./text";

export const Header = ({
  headerTxt,
  onMenuPress,
}: {
  headerTxt: string;
  onMenuPress?: () => void;
}) => {
  return (
    <View style={style.mainContainer}>
      <View style={style.txtContainer}>
        <Image
          source={require("../assets/images/logo1.png")}
          style={style.image}
        />
        <Texto id="3" textContent={headerTxt} />
      </View>
      <View>
        <Pressable onPress={onMenuPress} style={style.hamburger}>
          <Texto id="3" textContent="☰" />
        </Pressable>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
  txtContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffffed",
  },
  hamburger: {
    padding: 5,
  },

  mainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffffed",
    padding: 20,
    marginTop: 30,
    height: 60,
    gap: 15,
  },
});
