import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "../Button";
import SelectorToken from "../SelectToken";
import { TokenDetail } from "@/types/tokenType";
import { AddressState } from "@/types/types";
import { getName } from "@/utils/getNameCrypto";

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .required("Address is required")
    .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be greater than 0"),
});

interface SendTokenProps {
  options: AddressState[];
}

const SendToken: React.FC<SendTokenProps> = ({ options }: SendTokenProps) => {
  const initialValues = {
    address: "",
    amount: "",
  };

  const handleFormSubmit = (values: typeof initialValues) => {
    console.log("Form Submitted:", values);
    alert(`Sending ${values.amount} UNI to ${values.address}`);
  };
  const [selectedToken, setSelectedToken] = useState<AddressState>(options[0]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <View style={styles.containerToken}>
            <TextInput
              style={styles.input}
              placeholder="Type receive address"
              onChangeText={handleChange("address")}
              onBlur={handleBlur("address")}
              value={values.address}
            />
            {errors.address && touched.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}

            <SelectorToken
              options={options}
              setSelectedOption={setSelectedToken}
              selectedOption={selectedToken}
            />
          </View>

          <View style={styles.amountContainer}>
            <View style={styles.amountInputWrapper}>
              <TextInput
                style={styles.amountInput}
                placeholder={`18.0 ${getName(selectedToken.type)}`}
                keyboardType="numeric"
                onChangeText={handleChange("amount")}
                onBlur={handleBlur("amount")}
                value={values.amount}
              />
              {errors.amount && touched.amount && (
                <Text style={[styles.errorText, styles.errorAmount]}>
                  {errors.amount}
                </Text>
              )}
            </View>
            <Text style={styles.amountLabel}>$300</Text>
            <View style={styles.equalsContainer}>
              <View style={styles.equalsSign}>
                <Text style={styles.equals}>=</Text>
              </View>
            </View>
          </View>

          <Button
            label="Swipe to send"
            onPress={handleSubmit as any}
            containerStyles={{ width: "90%", margin: "auto", bottom: 20 }}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  containerToken: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    // borderWidth: 1,
    // borderColor: "#ccc",
    borderTopRightRadius: 20,
    borderTopStartRadius: 20,

    padding: 20,
    fontSize: 16,
    width: "100%",
    // backgroundColor: "#f5f5f5",
    // marginBottom: 10,
  },
  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  tokenLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  tokenText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  maxText: {
    fontSize: 14,
    color: "#888",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
    position: "relative",
    gap:3
  },
  amountInputWrapper: {
    alignItems: "center",
    width: "50%",
  },
  amountInput: {
    fontSize: 18,
    color: "#333",
    width: "100%",
    borderBottomStartRadius: 20,
    borderTopStartRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
    backgroundColor: "rgba(244, 245, 247, 1)",
  },
  amountLabel: {
    fontSize: 18,
    color: "#000",
    width: "50%",
    fontWeight: "bold",
    textAlign: "center",
    borderBottomEndRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: "rgba(244, 245, 247, 1)",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
  },
  equalsContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    transform:'translate(-50%, -50%)'
  },
  equalsSign: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 25,
    height: 25,
    backgroundColor: "rgba(244, 245, 247, 1)",
    borderRadius: 50,


  },
  equals: {
    fontSize: 16,
  
    color: "#000",
  },
  errorAmount: {
    position: "absolute",
    bottom:2
  },
  swipeButton: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  qrIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
    alignSelf: "flex-start",
    paddingLeft: 20,
  },
});

export default SendToken;
