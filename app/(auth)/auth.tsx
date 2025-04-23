import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import IconFaceID from "@/assets/svgComponents/IconFaceID";
import Button from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";

const Auth = () => {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const backgroundImage = require("../../assets/images/background.jpeg");

  const handleFaceAuth = async () => {
    try {
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (
        !supportedTypes.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
        )
      ) {
        Alert.alert("Notice", "Face ID is not supported on this device.");
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Face Authentication",
        cancelLabel: "Cancel",
        // fallbackLabel: "Use Passcode",
      });
      if (result.success) {
        Alert.alert("Success!", "Authenticated using Face ID.");
        router.replace("/(dashBoard)/home");
      } else {
        Alert.alert("Error", result.error || "Face authentication failed.");
      }
    } catch (error) {
      console.error("Face Authentication Error:", error);
      Alert.alert("Error", "An error occurred during Face ID authentication.");
    }
  };

  const handleFingerprintAuth = async () => {
    try {
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (
        !supportedTypes.includes(
          LocalAuthentication.AuthenticationType.FINGERPRINT
        )
      ) {
        Alert.alert(
          "Notice",
          "Fingerprint authentication is not supported on this device."
        );
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Fingerprint Authentication",
        cancelLabel: "Cancel",
        // fallbackLabel: "",
      });
      if (result.success) {
        Alert.alert("Success!", "Authenticated using fingerprint.");
        router.replace("/(dashBoard)/home");
      } else {
        Alert.alert(
          "Error",
          result.error || "Fingerprint authentication failed."
        );
      }
    } catch (error) {
      console.error("Fingerprint Authentication Error:", error);
      Alert.alert(
        "Error",
        "An error occurred during fingerprint authentication."
      );
    }
  };

  const handleDevicePassAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Device Passcode Authentication",
        cancelLabel: "Cancel",
        // fallbackLabel: "Use Passcode",
      });
      if (result.success) {
        Alert.alert("Success!", "Authenticated using device passcode.");
        router.replace("/(dashBoard)/home");
      } else {
        Alert.alert(
          "Error",
          result.error || "Device passcode authentication failed."
        );
      }
    } catch (error) {
      console.error("Device Passcode Authentication Error:", error);
      Alert.alert(
        "Error",
        "An error occurred during device passcode authentication."
      );
    }
  };

  const handlePasscodeAuth = async () => {
    setLoading(true);
    try {
      const savedPasscode = await SecureStore.getItemAsync("passcode");
      if (savedPasscode === passcode) {
        Alert.alert("Success!", "Successfully logged in.");
        router.push("/(dashBoard)/home");
      } else {
        Alert.alert("Error", "Incorrect passcode.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Authentication</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your passcode"
          secureTextEntry
          value={passcode}
          onChangeText={setPasscode}
          placeholderTextColor={"#cbcbcb"}
        />

        <Button
          label={loading ? "Processing..." : "Login"}
          onPress={handlePasscodeAuth}
          containerStyles={{ width: "100%", marginVertical: 20 }}
        />

        <View style={styles.containerLine}>
          <View style={styles.line} />
          <Text style={styles.text}>or</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.biometricOptions}>
          <TouchableOpacity
            style={styles.buttonBiometric}
            onPress={handleFaceAuth}
          >
            <IconFaceID color="black" size={35} />
            <Text style={styles.biometricText}>Face ID</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonBiometric}
            onPress={handleFingerprintAuth}
          >
            <Ionicons name="finger-print" size={32} color="black" />
            <Text style={styles.biometricText}>Fingerprint</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonBiometric}
            onPress={handleDevicePassAuth}
          >
            <Ionicons name="lock-closed-outline" size={32} color="black" />
            <Text style={styles.biometricText}>Device Pass</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Auth;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    color: "black",
  },
  input: {
    borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "white",
  },
  containerLine: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "70%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#393939",
    marginHorizontal: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  biometricOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  buttonBiometric: {
    alignItems: "center",
    width: "30%",
  },
  biometricText: {
    color: "black",
    marginTop: 5,
    fontSize: 13,
  },
});
