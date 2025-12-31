import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderPage from "@/components/ui/HeaderPage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PrivateKey = () => {
  const [isChecked, setIsChecked] = useState(false);
  const insets = useSafeAreaInsets();
  const TEXTWARNING = [
    {
      title:
        "Your Private Key will provide access to this account. Think of it as a login and password combined into one.",
      icon: "key-outline",
    },
    {
      title:
        "Anyone who has this Private Key will have full access to any funds contained in this account. Your funds may be lost.",
      icon: "alert-circle-outline",
    },
    {
      title:
        "Do not share your Private Key with any 3rd party, person, website or application.",
      icon: "lock-closed-outline",
    },
  ];

  return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20 }}>
        <HeaderPage title="Show Private Key" />
      </View>

      {/* Icon */}

      <View style={styles.iconContainer}>
        <Ionicons name="warning" color="#FF5555" size={70} />
      </View>
      {/* Title */}
      <Text style={styles.title}>Keep Your Private Key Secret</Text>

      {/* Warning Items */}
      <View style={styles.warningContainer}>
        {TEXTWARNING.map((item, index) => (
          <View style={styles.warningItem} key={index}>
            <Ionicons
              name={item.icon as any}
              size={24}
              color="#FF5555"
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>{item.title}</Text>
          </View>
        ))}
      </View>

      {/* Spacer to push checkbox to bottom */}
      <View style={styles.spacer} />

      {/* Checkbox and Text */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
          <Ionicons
            name={isChecked ? "checkbox-outline" : "square-outline"}
            size={24}
            color={isChecked ? "#00A3FF" : "#000"}
          />
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          I will not share my Private Key with any 3rd party, person, website or
          application.
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, !isChecked && styles.buttonDisabled]}
        disabled={!isChecked}
        onPress={() => router.push("/(wallet)/manager/private-key-recovery")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PrivateKey;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  iconContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  title: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  warningContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  warningItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  warningIcon: {
    marginRight: 10,
  },
  warningText: {
    color: "#000",
    fontSize: 15,
    flex: 1,
    fontWeight: "500",
  },
  spacer: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  checkboxText: {
    color: "#000",
    fontSize: 15,
    flex: 1,
    marginLeft: 10,
    fontWeight: "500",
  },
  button: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 50,
    shadowColor: "rgba(43, 45, 51)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    marginHorizontal: 20,
    ...Platform.select({
      android: {
        marginBottom: 10, 
      },
    }),
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
