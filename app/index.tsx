import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import Logo from "../assets/images/logo.svg";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useState } from "react";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import ethService from "@/services/ether";
import solanaService from "@/services/solana";
import { AddressState, GeneralStatus } from "@/types/types";
import {
  saveEthereumAddresses,
  updateEthereumAddresses,
} from "@/store/ethereumSlice";
import {
  saveSolanaAddresses,
  updateSolanaAddresses,
} from "@/store/solanaSlice";
import { getPhrase } from "@/hooks/useStorageState";
import { useRouter } from "expo-router";
import { ROUTES } from "@/constants/routes";
import React from "react";
import * as SecureStore from "expo-secure-store";

const OnBoarding = () => {
  //   if (!loading && isLogged) return <Redirect href="/home" />;
  const image = require("../assets/images/background.jpeg");

  const router = useRouter();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAccount = async () => {
      try {
        const mnemonic = await SecureStore.getItemAsync("mnemonic");
        if (mnemonic) {
          setTimeout(() => {
            router.replace("/(auth)/auth");
          }, 500);
        } else {
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra tài khoản:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccount();
  }, []);

  const walletSetup = async () => {
    try {
      const ethWallet = await ethService.createWallet();

      if (!ethWallet.mnemonic || !ethWallet.mnemonic.phrase) {
        throw new Error("Failed to create wallet: mnemonic is null");
      }
      const masterMnemonicPhrase = ethWallet.mnemonic.phrase;
      const solWallet = await solanaService.restoreWalletFromPhrase(
        masterMnemonicPhrase
      );

      const ethereumAccount: AddressState = {
        accountName: "Account 1",
        derivationPath: `m/44'/60'/0'/0/0`,
        address: ethWallet.address,
        publicKey: ethWallet.publicKey,
        balance: 0,
        transactionMetadata: {
          paginationKey: undefined,
          transactions: [],
        },
        failedNetworkRequest: false,
        status: GeneralStatus.Idle,
        transactionConfirmations: [],
      };

      const solanaAccount: AddressState = {
        accountName: "Account 1",
        derivationPath: `m/44'/501'/0'/0'`,
        address: solWallet.publicKey.toBase58(),
        publicKey: solWallet.publicKey.toBase58(),
        balance: 0,
        transactionMetadata: {
          paginationKey: undefined,
          transactions: [],
        },
        failedNetworkRequest: false,
        status: GeneralStatus.Idle,
        transactionConfirmations: [],
      };

      dispatch(saveEthereumAddresses([ethereumAccount]));
      dispatch(saveSolanaAddresses([solanaAccount]));
      setTimeout(() => setLoading(false), 1000);
      if (!loading) {
        router.push({
          pathname: "/(wallet)/seed/seed-phrase",
          params: { phrase: masterMnemonicPhrase },
        });
      }
    } catch (err) {
      console.error("Failed to create wallet", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.containerView}>
          <View style={styles.containerViewLogo}>
            <Logo width={134} height={125} />

            <Text style={styles.title}>DEX.FM</Text>
            <ThemedText style={styles.subTitle} type="subtitle">
              The DEX For Memes
            </ThemedText>
          </View>
          <View style={styles.containerViewButton}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() => {
                setLoading(true);
                setTimeout(() => walletSetup(), 1000);
              }}
            >
              <View style={styles.contentButton}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <IconSymbol name="plus" color="#fff" size={20} />
                    <Text style={styles.text}>Create new wallet</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push("/(wallet)/seed/wallet-import-seed-phrase")
              }
            >
              <Text style={styles.textImportWallet}>
                or import an existing wallet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default OnBoarding;

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
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerViewLogo: {
    alignItems: "center",
    marginTop: 100,
  },
  title: {
    fontSize: 40,
    marginTop: 10,
    fontWeight: 800,
  },
  subTitle: {
    fontSize: 28,
    fontWeight: 500,
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
  textImportWallet: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
