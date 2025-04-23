import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import HeaderHome from "@/components/home/HeaderHome";
import Button from "@/components/Button";
import IconSend from "@/assets/svgComponents/IconSend";
import IconQRCode from "@/assets/svgComponents/IconQRCode";
import { formatCurrency } from "@/utils/formatCurrency";
import ListToken from "@/components/home/ListToken";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
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
import WrapDashboard from "../../components/home/WrapDashboard";
import ListFavorites from "@/components/home/ListFavorites";


enum TypeBottomSheet {
  Receive = "Receive",
  Send = "Send",
}

const Favorite = () => {
  const [typeBottomSheet, setTypeBottomSheet] = useState<TypeBottomSheet>(
    TypeBottomSheet.Receive
  );

  const dispatch = useDispatch();

  const ethereumAccounts = useSelector(
    (state: RootState) => state.ethereum.addresses
  );
  const solanaAccounts = useSelector(
    (state: RootState) => state.solana.addresses
  );

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
    <WrapDashboard>
      <ListFavorites/>
    </WrapDashboard>
  );
};

export default Favorite;

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
