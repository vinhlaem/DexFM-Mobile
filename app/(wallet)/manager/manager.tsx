import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons"; // Cần cài đặt @expo/vector-icons
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Cần cài đặt
import CustomImage from "@/components/ImageCustomer";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import HeaderPage from "@/components/ui/HeaderPage";

const Manager = () => {
  const insets = useSafeAreaInsets();

  const ethAccounts = useSelector(
    (state: RootState) => state.ethereum.addresses
  );

  const accountItems = useMemo(() => {
    return [
      {
        label: "Account Name",
        onPress: () => router.push("/(wallet)/manager/edit-name"),
      },
      {
        label: "Account Addresses",
        onPress: () => router.push("/(wallet)/manager/account-addresses"),
      },
      {
        label: "Show Recovery Phrase",
        onPress: () => router.push("/(recovery)/recovery"),
      },
      {
        label: "Show Private Key",
        onPress: () => router.push("/(wallet)/manager/private-key"),
      },
    ];
  }, [ethAccounts]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 20 }}>
        <HeaderPage title="Account Manager" />
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <CustomImage
            source={"ok"}
            size={80}
            address={ethAccounts[0].address}
            avatar={true}
            width={80}
            height={80}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Items */}
      <View style={styles.accountItems}>
        {accountItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.itemContainer]}
            onPress={item.onPress}
          >
            <Text style={styles.itemLabel}>{item.label}</Text>
            <View style={styles.itemRight}>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Manager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#A78BFA",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarText: {
    color: "black",
    fontSize: 40,
    fontWeight: "bold",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  accountItems: {
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
  },
 
  itemLabel: {
    color: "#000",
    fontSize: 16,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },

});
