import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import ethService from "@/services/ether";
import { AddressState, GeneralStatus } from "@/types/types";
import { saveEthereumAddresses } from "@/store/ethereumSlice";
import { ROUTES } from "@/constants/routes";
import * as SecureStore from "expo-secure-store";

import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character."
    )
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match.")
    .required("Confirm password is required."),
});

export default function WalletSetup() {
  const image = require("../../../assets/images/background.jpeg");

  const { successState } = useLocalSearchParams();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const savePasscode = async (passcode: string) => {
    try {
      await SecureStore.setItemAsync("passcode", passcode);
      Alert.alert("Success!", "Your password saved");

      router.push({
        pathname: "/(wallet)/setup/wallet-created-successfully",
        params: {
          successState:
            successState === "CREATED_WALLET"
              ? "CREATED_WALLET"
              : "IMPORTED_WALLET",
        },
      });
    } catch (error) {
      Alert.alert("Error", "Can't save password");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={image}
            resizeMode="cover"
            style={styles.imageBackground}
          >
            <View style={styles.container}>
              <View style={styles.containerText}>
                <Text style={styles.textPassword}>Create Password</Text>
                <Text style={styles.textDescription}>
                  This password allows you to lock your extension and create
                  another secure layer for your wallet
                </Text>
              </View>
              <View style={styles.containerInput}>
                <Formik
                  initialValues={{ password: "", confirmPassword: "" }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    savePasscode(values.password);
                  }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <View style={styles.containerForm}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Password"
                          placeholderTextColor="#cbcbcb"
                          secureTextEntry
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                        />
                        {touched.password && errors.password && (
                          <Text style={styles.errorText}>
                            {errors.password}
                          </Text>
                        )}

                        <TextInput
                          style={styles.input}
                          placeholder="Confirm Password"
                          placeholderTextColor="#cbcbcb"
                          secureTextEntry
                          onChangeText={handleChange("confirmPassword")}
                          onBlur={handleBlur("confirmPassword")}
                          value={values.confirmPassword}
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                          <Text style={styles.errorText}>
                            {errors.confirmPassword}
                          </Text>
                        )}
                      </View>

                      <Button
                        label="Create password"
                        onPress={handleSubmit}
                        containerStyles={styles.buttonContainer}
                      />
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 50
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  containerText: {
    padding: 30,
    borderBottomWidth: 1,
    borderColor: "#568373",
  },
  textPassword: {
    fontSize: 20,
    fontWeight: "700",
  },
  textDescription: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
  },
  containerInput: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 30,
    paddingRight: 30,
  },
  containerForm: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  inputContainer: {
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "white",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 20,
    alignSelf: "center",
  },
});