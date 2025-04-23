import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import ethService from "@/services/ether";
import solanaService from "@/services/solana";
import { AddressState, GeneralStatus } from "@/types/types";
import { savePhrase } from "@/hooks/useStorageState";
import {
  fetchEthereumBalance,
  fetchEthereumTransactions,
  saveEthereumAddresses,
} from "@/store/ethereumSlice";
import {
  fetchSolanaBalance,
  fetchSolanaTransactions,
  saveSolanaAddresses,
} from "@/store/solanaSlice";
import { router } from "expo-router";
import { ROUTES } from "@/constants/routes";
import images from "@/constants/images";
import { IconSymbol } from "@/components/ui/IconSymbol";

const walletImportSeedPhrase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [textValue, setTextValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [captions, setCaptions] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isInputFocused, setInputFocused] = useState(false);

  const captionsArr: string[] = [
    "We're fetching your wallet details...",
    "Importing wallet securely...",
    "Syncing with the blockchain...",
  ];
  const titleArr: string[] = [
    "Hang tight!",
    "This might take a minute.",
    "Almost there!",
  ];

  const setCaptionsInterval = () => {
    setTitle(titleArr[0]);
    setCaptions(captionsArr[0]);
    let interval: NodeJS.Timeout = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * captionsArr.length);
      setTitle(titleArr[randomIndex]);
      setCaptions(captionsArr[randomIndex]);
    }, 8000);
    return () => {
      clearInterval(interval);
      setTitle("");
      setCaptions("");
    };
  };

  const handleVerifySeedPhrase = async () => {
    setLoading(true);
    const errorText =
      "Looks like the seed phrase is incorrect. Please try again.";
    const phraseTextValue = textValue.trimEnd();
    if (phraseTextValue.split(" ").length !== 12) {
      setError(errorText);
      setLoading(false);
      return;
    }

    const captionsInterval = setCaptionsInterval();
    setError("");
    try {
      // Logic is needed to find the crypto currency with the highest amount of accounts created
      // and using that index to create the same amount of addresses via hd wallets
      let highestIndex = 0;
      const unusedEthIndex = await ethService.findNextUnusedWalletIndex(
        phraseTextValue
      );

      const unusedSolIndex = await solanaService.findNextUnusedWalletIndex(
        phraseTextValue
      );

      highestIndex = Math.max(unusedEthIndex, unusedSolIndex);
      const importedEthWallets = await ethService.importAllActiveAddresses(
        phraseTextValue
      );

      const importedSolWallets = await solanaService.importAllActiveAddresses(
        phraseTextValue,
        highestIndex
      );

      const transformedActiveEthAddresses: AddressState[] =
        importedEthWallets.map((info, index) => {
          return {
            accountName: `Account Ethereum ${index + 1}`,
            derivationPath: info.derivationPath,
            address: info.address,
            publicKey: info.publicKey,
            balance: 0,
            transactionMetadata: {
              paginationKey: undefined,
              transactions: [],
            },
            failedNetworkRequest: false,
            status: GeneralStatus.Idle,
            transactionConfirmations: [],
            type: "ethereum",
          };
        });

      const transformedActiveSolAddresses: AddressState[] =
        importedSolWallets.map((info, index) => {
          return {
            accountName: `Account Solana ${index + 1}`,
            derivationPath: info.derivationPath,
            address: info.publicKey,
            publicKey: info.publicKey,
            balance: 0,
            transactionMetadata: {
              paginationKey: undefined,
              transactions: [],
            },
            failedNetworkRequest: false,
            status: GeneralStatus.Idle,
            transactionConfirmations: [],
            type: "solana",
          };
        });
      await savePhrase(JSON.stringify(phraseTextValue));

      dispatch(saveEthereumAddresses(transformedActiveEthAddresses));
      dispatch(fetchEthereumBalance(transformedActiveEthAddresses[0].address));
      dispatch(
        fetchEthereumTransactions({
          address: transformedActiveEthAddresses[0].address,
        })
      );

      dispatch(saveSolanaAddresses(transformedActiveSolAddresses));
      dispatch(fetchSolanaBalance(transformedActiveSolAddresses[0].address));
      dispatch(
        fetchSolanaTransactions(transformedActiveSolAddresses[0].address)
      );

      router.push({
        pathname: `/(wallet)/setup/wallet`,
        params: { successState: "IMPORTED_WALLET" },
      });
    } catch (err) {
      setError("Failed to import wallet");
      console.error("Failed to import wallet", err);
      setLoading(false);
    } finally {
      captionsInterval();
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.image}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <TouchableOpacity onPress={() => router.back()}>
                  <IconSymbol name="arrow.left" color="#000" size={20} />
                </TouchableOpacity>
                <Text style={styles.title}>Secret Recovery Phrase</Text>
              </View>
              <ThemedText style={styles.subTitle} type="subtitle">
                Start the process to restore your wallet by entering your 12 or
                24-word recovery phrase below.
              </ThemedText>
            </View>
            <TextInput
              style={styles.inputText}
              autoCapitalize="none"
              multiline
              returnKeyType="done"
              value={textValue}
              readOnly={false}
              onChangeText={setTextValue}
              placeholder="Enter your seed phrase"
              placeholderTextColor="gray"
              onFocus={() => setInputFocused(true)}
              onEndEditing={() => setInputFocused(false)}
              blurOnSubmit
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
        </ScrollView>
        {error && (
          <View style={styles.textErrorContainer}>
            <Text style={styles.textError}>{error}</Text>
          </View>
        )}
        <View
          style={{ alignItems: "center", marginTop: 10, paddingBottom: 30 }}
        >
          {title !== "" && captions !== "" && (
            <View style={{ marginBottom: 20 }}>
              <ThemedText type="title">{title}</ThemedText>
              <ThemedText type="subtitle">{captions}</ThemedText>
            </View>
          )}
          <TouchableOpacity
            onPress={() => handleVerifySeedPhrase()}
            style={styles.touchableOpacity}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: 500 }}>
                Verify seed phrase
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default walletImportSeedPhrase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    padding: 0,
    justifyContent: "space-around",
  },
  viewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  textContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 400,
    marginTop: 10,
  },
  inputText: {
    justifyContent: "flex-start",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    color: "#000",
    fontSize: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
  },

  textErrorContainer: {
    alignItems: "center",
  },
  textError: {
    color: "red",
    fontSize: 14,
    fontWeight: 500,
    marginTop: 10,
    textAlign: "center",
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
  },
});
