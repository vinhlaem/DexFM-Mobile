import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ROUTES } from "@/constants/routes";
import { ThemedText } from "@/components/ThemedText";
import Logo from "../../../assets/images/logo.svg";
import images from "@/constants/images";

const walletCreatedSuccessfully = () => {
  const { successState } = useLocalSearchParams();
  const [title, setTitle] = useState("Create wallet Successfully");
  const [subtitle, setSubtitle] = useState(
    "Your new digital wallet is ready! Dive into securing and exploring your financial future. Your crypto journey starts now."
  );

  useEffect(() => {
    if (successState === "IMPORTED_WALLET") {
      setTitle("Wallet Imported Successfully");
      setSubtitle(
        "Your imported wallet is ready! Dive into securing and exploring your financial future. Your crypto journey starts now."
      );
    }
  }, [successState]);


  useEffect(() => {
    setTimeout(() => {
      router.push("/(dashBoard)/home");
    }, 3000);
  }, []);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.image}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.containerView}>
          <View style={styles.containerViewLogo}>
            <Logo width={134} height={125} />

            <Text style={styles.title}>{title}</Text>

            <ThemedText style={styles.textDefault} type="default">
              {subtitle}
            </ThemedText>
          </View>
          {/* <View style={styles.containerViewButton}>
            <TouchableOpacity
              style={styles.buttonHome}
              onPress={() => router.push("/(dashBoard)/home")}
            >
              <Text style={styles.textHome}>Go to home</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </ImageBackground>
    </View>
  );
};

export default walletCreatedSuccessfully;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },

  containerView: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 40,
    paddingLeft: 10,
    paddingRight: 10,

    alignItems: "center",
    justifyContent: "space-between",
  },
  containerViewLogo: {
    alignItems: "center",
    marginTop: 100,
  },
  title: {
    fontSize: 25,
    marginTop: 10,
    fontWeight: 800,
  },

  textDefault: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
  image: {
    height: 135,
    width: 120,
  },
  containerViewButton: {
    width: "100%",
    alignItems: "center",
  },
  touchableOpacity: {
    width: "90%",
    height: 50,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    shadowColor: "rgba(43, 45, 51)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,

    // marginTop: 100,
  },
  contentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonHome: {
    backgroundColor: "#000",
    width: "100%",
    borderRadius: 50,
    height: 50,
    color: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  textHome: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
