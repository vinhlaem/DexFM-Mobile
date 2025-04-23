import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getPhrase } from "@/hooks/useStorageState";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import HeaderPage from "@/components/ui/HeaderPage";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AddressState } from "@/types/types";
import SelectorToken from "@/components/SelectToken";
import CustomSelector from "@/components/Selector";

const PrivateKeyRecovery = () => {
  const solanaAccounts = useSelector(
    (state: RootState) => state.solana.addresses
  );
  const ethereumAccounts = useSelector(
    (state: RootState) => state.ethereum.addresses
  );
  const accounts = useMemo(
    () => [...ethereumAccounts, ...solanaAccounts],
    [solanaAccounts, ethereumAccounts]
  );

  const [selectedAccount, setSelectedAccount] = useState<AddressState>(
    accounts[0]
  );
  const insets = useSafeAreaInsets();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(selectedAccount.publicKey);
    alert("Private Key copied to clipboard!");
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HeaderPage title="Your Private Key" />

        {/* Warning Section */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>
            Do not share your Recovery Phrase!
          </Text>
          <Text style={styles.warningText}>
            If someone has your Recovery Phrase they will have full control of
            your wallet.
          </Text>
        </View>

        <CustomSelector
          options={accounts}
          selectedOption={selectedAccount}
          setSelectedOption={setSelectedAccount}
          containerStyle={{ marginVertical: 20 }}
        />

        <View style={styles.wordContainer}>
          <Text style={styles.wordText}>{selectedAccount.publicKey}</Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          <Ionicons
            name="copy-outline"
            size={20}
            color="black"
            style={styles.copyIcon}
          />
          <Text style={styles.copyText}>Copy to clipboard</Text>
        </TouchableOpacity>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrivateKeyRecovery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  warningContainer: {
    marginBottom: 20,
  },
  warningTitle: {
    color: "#FF5555",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  warningText: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    marginBottom: 10,
  },
  wordText: {
    color: "black",
    fontSize: 15,
    backgroundColor: "#E5E5E5",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
  },
  spacer: {
    flex: 1,
  },
  
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  copyIcon: {
    marginRight: 5,
  },
  copyText: {
    color: "black",
    fontSize: 14,
  },
  doneButton: {
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
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});