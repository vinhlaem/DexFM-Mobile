import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import HeaderPage from "@/components/ui/HeaderPage";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CustomSelector from "@/components/Selector";
import CustomQRCode from "@/components/QRCode";
import { getLogo } from "@/utils/getLogoCrypto";
import { getNameShareAddress } from "@/utils/getNameCrypto";
import IconQRCode from "@/assets/svgComponents/IconQRCode";
import ButtonHome from "@/components/Button";
import * as Clipboard from "expo-clipboard";

const AccountAddresses = () => {
  const ethereumAccounts = useSelector(
    (state: RootState) => state.ethereum.addresses
  );
  const solanaAccounts = useSelector(
    (state: RootState) => state.solana.addresses
  );

  const [selectedOption, setSelectedOption] = useState(ethereumAccounts[0]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(selectedOption.address);
    alert("Address copied to clipboard");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ paddingHorizontal: 20 }}>
        <HeaderPage title="Account Addresses" />
      </View>
      <View style={styles.container}>
        <CustomSelector
          options={[...ethereumAccounts, ...solanaAccounts]}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          containerStyle={{ marginVertical: 20 }}
        />
        <CustomQRCode
          value={selectedOption.address}
          size={256}
          level="H"
          bgColor="#f0f0f0"
          fgColor="#333333"
          logo={getLogo(selectedOption.type)}
          logoSize={50}
        />
        <Text style={[styles.addressLabel]}>
          {getNameShareAddress(selectedOption.type)}
        </Text>
        <Text style={[styles.address]}>{selectedOption.address}</Text>
        
      </View>
      <View style={styles.spacer}/>

     <View style={styles.buttonContainer}>
        <ButtonHome
            icon={<IconQRCode size={25} color="white" />}
            label="Copy to clipboard"
            containerStyles={styles.button}
            onPress={() => handleCopy()}
          />
     </View>
    </SafeAreaView>
  );
};

export default AccountAddresses;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 20,
    width: "100%",
    textAlign: "center",
  },
  address: {
    color: "#878787",
    fontSize: 16,
    fontWeight: "400",
    width: "100%",
    textAlign: "center",
    marginTop: 10,
  },
  bold: {
    fontWeight: "600",
    color: "#454545",
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
   justifyContent: 'center',
    alignItems: "center",
    width: "100%",
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
    width: "90%",
    marginHorizontal: 20,
  },
});
