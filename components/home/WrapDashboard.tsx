import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { Children, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import HeaderHome from "@/components/home/HeaderHome";
import Button from "@/components/Button";
import IconSend from "@/assets/svgComponents/IconSend";
import IconQRCode from "@/assets/svgComponents/IconQRCode";
import { formatCurrency } from "@/utils/formatCurrency";
import ListToken from "@/components/home/ListToken";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { saveEthereumAddresses } from "@/store/ethereumSlice";
import { saveSolanaAddresses } from "@/store/solanaSlice";
import { AddressState, GeneralStatus } from "@/types/types";
import ethService from "@/services/ether";
import solanaService from "@/services/solana";
import { formatAddress } from "@/utils/formatAddress";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import ShareAddress from "@/components/home/ShareAddress";
import { Ionicons } from "@expo/vector-icons";
import SendToken from "@/components/home/Send";
import { tokenDetails } from "@/data/mockData";
import { loadFavorites } from "@/store/favoriteSlice";

enum TypeBottomSheet {
  Receive = "Receive",
  Send = "Send",
}

const WrapDashboard = ({children}:{children: ReactNode}) => {
  const [typeBottomSheet, setTypeBottomSheet] = useState<TypeBottomSheet>(
    TypeBottomSheet.Receive
  );


  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const ethereumAccounts = useSelector(
    (state: RootState) => state.ethereum.addresses
  );
  const solanaAccounts = useSelector(
    (state: RootState) => state.solana.addresses
  );
  // useEffect(() => {
  //   const fetchBalances = async () => {
  //     try {
  //       const updatedEthereum: AddressState[] = await Promise.all(
  //         ethereumAccounts.map(async (account) => {
  //           const balance = await ethService.getBalance(account.address);
  //           return {
  //             accountName: account.accountName || "Ethereum Account",
  //             derivationPath: account.derivationPath,
  //             publicKey: account.publicKey,
  //             address: account.address,
  //             balance: Number(balance),
  //             status: GeneralStatus.Success,
  //             failedNetworkRequest: false,
  //             transactionMetadata: account.transactionMetadata || {
  //               transactions: [],
  //               paginationKey: undefined,
  //             },
  //             transactionConfirmations: account.transactionConfirmations || [],
  //           };
  //         })
  //       );

  //       const updatedSolana: AddressState[] = await Promise.all(
  //         solanaAccounts.map(async (account) => {
  //           const balance = await solanaService.getBalance(account.address);
  //           return {
  //             accountName: account.accountName || "Solana Account",
  //             derivationPath: account.derivationPath,
  //             publicKey: account.publicKey,
  //             address: account.address,
  //             balance: Number(balance),
  //             status: GeneralStatus.Success,
  //             failedNetworkRequest: false,
  //             transactionMetadata: account.transactionMetadata || {
  //               transactions: [],
  //               paginationKey: undefined,
  //             },
  //             transactionConfirmations: account.transactionConfirmations || [],
  //           };
  //         })
  //       );

  //       dispatch(saveEthereumAddresses(updatedEthereum));
  //       dispatch(saveSolanaAddresses(updatedSolana));
  //     } catch (error) {
  //       console.error("Lỗi khi lấy số dư:", error);
  //     }
  //   };

  //   if (ethereumAccounts.length || solanaAccounts.length) {
  //     fetchBalances();
  //   }
  // }, [ethereumAccounts, solanaAccounts]);

  const snapPoints = useMemo(() => ["90%"], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleOpenBottomSheet = (type: TypeBottomSheet) => {
    if (!isBottomSheetOpen) {
      bottomSheetRef.current?.expand();
      setIsBottomSheetOpen(true);
      setTypeBottomSheet(type);
    }
  };

  const handleCloseBottomSheet = () => {
    if (isBottomSheetOpen) {
      bottomSheetRef.current?.close();
      setIsBottomSheetOpen(false);
    }
  };

  
  
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome />

      <View style={{ marginVertical: 10, width: "90%" }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <Text style={styles.labelMyWallet}>My Wallet</Text>
          <Text style={[styles.labelMyWallet, styles.textWalletCode]}>
            {formatAddress(ethereumAccounts[0].address)}
          </Text>
        </View>
        <Text style={styles.currencyTitle}>
          {formatCurrency(ethereumAccounts[0].balance)}
        </Text>
      </View>

      <View style={styles.containerButton}>
        <Button
          icon={<IconSend color="white" size={20} />}
          label="Send"
          onPress={() => handleOpenBottomSheet(TypeBottomSheet.Send)}
        />
        <Button
          icon={<IconQRCode />}
          label="Receive"
          onPress={() => handleOpenBottomSheet(TypeBottomSheet.Receive)}
        />
      </View>

      {children}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => setIsBottomSheetOpen(false)}
        overDragResistanceFactor={0}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Pressable
              style={[styles.hiddenBottomSheet, styles.center]}
              onPress={handleCloseBottomSheet}
            >
              <Ionicons name="chevron-back-outline" size={20} color="#000" />
            </Pressable>
            <Text style={styles.headerText}>
              {typeBottomSheet === TypeBottomSheet.Receive ? "Receive" : "Send"}
            </Text>
            <View style={styles.placeholder} />
          </View>
          {/* Content */}
          {typeBottomSheet === TypeBottomSheet.Receive && <ShareAddress />}
          {typeBottomSheet === TypeBottomSheet.Send && <SendToken  options={[...ethereumAccounts, ...solanaAccounts]} />}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default WrapDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  containerButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  currencyTitle: {
    fontSize: 36,
    fontWeight: "500",
  },
  labelMyWallet: {
    color: "rgba(145, 148, 166, 1)",
    fontWeight: "400",
    fontSize: 18,
  },
  textWalletCode: {
    marginStart: 10,
    backgroundColor: "rgba(244, 245, 248, 1)",
    paddingHorizontal: 5,
    borderRadius: 20,
  },

  // BottomSheet styles
  bottomSheetBackground: {
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
  },
  bottomSheetContainer: {
    flex: 1,
    alignItems: "center",
  },

  headerContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hiddenBottomSheet: {
    width: 40,
    height: 40,
    boxShadow: "0px 6px 16px 0px #2B2D3314",
    borderRadius: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
