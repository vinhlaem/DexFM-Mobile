import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import HeaderPage from "@/components/ui/HeaderPage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getNameShareAddress } from "@/utils/getNameCrypto";
import { getLogo } from "@/utils/getLogoCrypto";
import { updateAccountName } from "@/store/ethereumSlice";
import { updateSolanaAccountName } from "@/store/solanaSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

const EditName = () => {
  const insets = useSafeAreaInsets();
  
  const ethereumAccounts = useSelector(
    (state: RootState) => state.ethereum.addresses
  );
  const solanaAccounts = useSelector(
    (state: RootState) => state.solana.addresses
  );

  const dispatch = useDispatch();

  const accounts = [...ethereumAccounts, ...solanaAccounts];

  const [type, setType] = useState<string | null>(null);

  const [accountNameInput, setAccountNameInput] = useState("");

  const handleSave = () => {
    if (type === "ethereum") {
      dispatch(
        updateAccountName({
          accountName: accountNameInput,
          ethAddress: ethereumAccounts[0].address,
        })
      );
    } else if (type === "solana") {
      dispatch(
        updateSolanaAccountName({
          accountName: accountNameInput,
          solAddress: solanaAccounts[0].address,
        })
      );
    }
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20 }}>
        <HeaderPage title="Edit Name" />
      </View>
      {type ? (
        <View style={styles.itemHasName}>
          <View style={styles.itemContainer}>
            <View style={styles.item}>
              <Image source={getLogo(type as string)} style={styles.icon} />
              <Text style={styles.itemLabel}>
                {getNameShareAddress(type as string)}
              </Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            value={accountNameInput}
            onChangeText={(text) => setAccountNameInput(text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.accountItems}>
          {accounts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.itemContainer]}
              onPress={() => {
                setType(item.type);
                setAccountNameInput(item.accountName);
              }}
            >
              <View style={styles.item}>
                <Image source={getLogo(item.type)} style={styles.icon} />
                <Text style={styles.itemLabel}>
                  {getNameShareAddress(item.type)}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemNameAccount}>{item.accountName}</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  accountItems: {
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "90%",
    marginTop: 20,
  },

  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 100,
    width: "90%",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
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

  itemHasName: {
    justifyContent: "center",
    alignItems: "center",
  },

  itemLabel: {
    color: "#000",
    fontSize: 16,
  },

  itemNameAccount: {
    color: "#888",
    fontSize: 14,
  },
});
