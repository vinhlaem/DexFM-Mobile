import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import ethService from "@/services/ether";
import solanaService from "@/services/solana";
import { AddressState, GeneralStatus } from "@/types/types";
import { saveEthereumAddresses } from "@/store/ethereumSlice";
import { saveSolanaAddresses } from "@/store/solanaSlice";
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

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const savePasscode = async (passcode: string) => {
    try {
      await SecureStore.setItemAsync("passcode", passcode);
      Alert.alert("Thành công!", "Mật khẩu đã được lưu.");
      router.push("/(wallet)/setup/wallet-created-successfully");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu mật khẩu.");
    }
  };

  return (
    <View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                    console.log("Submitted values:", values);
                    // alert("Password is valid!");
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
                      <View>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Password"
                          placeholderTextColor="#568373"
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

                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Confirm Password"
                          placeholderTextColor="#568373"
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

                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleSubmit()}
                      >
                        <Text style={styles.buttonText}>Create account</Text>
                      </TouchableOpacity>
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
  container: {
    // padding: 10,
    marginTop: 50,
    flex: 1,
  },
  imageBackground: {
    // flex: 1,
    // justifyContent: "center",
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
    fontWeight: 700,
  },
  textDescription: {
    fontSize: 16,
    fontWeight: 400,
    marginTop: 10,
  },

  containerInput: {
    paddingTop: 50,
    paddingLeft: 30,
    paddingRight: 30,
  },
  containerForm: {
    // flex: 1,
    justifyContent: "space-between",
    height: "83%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#568373",
    borderRadius: 50,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#568373",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 10,
    shadowColor: "rgba(43, 45, 51)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
