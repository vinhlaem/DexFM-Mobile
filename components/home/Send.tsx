import React, { useState } from "react";
import { TextInput, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "../Button";
import SelectorToken from "../SelectToken";
import { TokenDetail } from "@/types/tokenType";

const validationSchema = Yup.object().shape({
    address: Yup.string()
        .required("Address is required")
        .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
    amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be greater than 0")
});

interface SendTokenProps {
    options: TokenDetail[];
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
    const [selectedToken, setSelectedToken] = useState<TokenDetail>(options[0]);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.container}>
                    {/* Địa chỉ ví */}
                    <Text style={styles.label}>Type receive address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter wallet address"
                        onChangeText={handleChange("address")}
                        onBlur={handleBlur("address")}
                        value={values.address}
                    />
                    {errors.address && touched.address && (
                        <Text style={styles.errorText}>{errors.address}</Text>
                    )}

                    {/* Số lượng token */}
                    <SelectorToken options={options} setSelectedOption={setSelectedToken} selectedOption={selectedToken} />
                    <Text style={styles.label}>UNI</Text>
                    <Text style={styles.maxText}>Max: 21.24 UNI (~$351.94)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter amount to send"
                        keyboardType="numeric"
                        onChangeText={handleChange("amount")}
                        onBlur={handleBlur("amount")}
                        value={values.amount}
                    />
                    {errors.amount && touched.amount && (
                        <Text style={styles.errorText}>{errors.amount}</Text>
                    )}

                    <Button label="Swipe to send" onPress={handleSubmit as any} containerStyles={{ width: '90%', margin: 'auto', bottom: 20 }} />
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        width: '100%',
        flex: 1
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    maxText: {
        fontSize: 14,
        color: "#888",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    swipeButton: {
        backgroundColor: "#000",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    swipeText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 5,
    },
});

export default SendToken;