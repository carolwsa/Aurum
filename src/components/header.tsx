import { Image, Pressable, StyleSheet, Text, View } from "react-native";
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
          <Text style={style.hamburger}>☰</Text>
        </Pressable>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
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
    fontSize: 26,
  },

  mainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffffed",
    padding: 20,
    paddingTop: 0,
    height: 90,
    gap: 15,
  },
});
