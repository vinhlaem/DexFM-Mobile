import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Kiểm tra và thực hiện xác thực sinh trắc học
  const handleBiometricAuth = async () => {
    try {
      // Kiểm tra xem thiết bị có hỗ trợ phần cứng sinh trắc học không
      const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
      if (!hasBiometrics) {
        Alert.alert("Thông báo", "Thiết bị không hỗ trợ phần cứng xác thực sinh trắc học.");
        return;
      }

      // Kiểm tra xem người dùng đã kích hoạt sinh trắc học chưa
      const biometricsEnabled = await LocalAuthentication.isEnrolledAsync();
      if (!biometricsEnabled) {
        Alert.alert("Thông báo", "Thiết bị chưa đăng ký vân tay hoặc khuôn mặt.");
        return;
      }

      // Lấy danh sách các loại sinh trắc học hỗ trợ
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      // Đặt cấu hình xác thực
      const authOptions = {
        promptMessage: "Xác thực sinh trắc học",
        cancelLabel: "Hủy",
        fallbackLabel: "Sử dụng mật khẩu",
      };

      // Kiểm tra loại xác thực được hỗ trợ
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        console.log("Sử dụng vân tay...");
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        console.log("Sử dụng khuôn mặt...");
      } else {
        console.log("Fallback sang mật khẩu...");
      }

      // Thực hiện xác thực (vân tay, khuôn mặt, hoặc fallback)
      const result = await LocalAuthentication.authenticateAsync(authOptions);

      // Kiểm tra kết quả xác thực
      if (result.success) {
        Alert.alert("Thành công!", "Đăng nhập bằng sinh trắc học.");
        router.replace("/(dashBoard)/home"); // Điều hướng đến màn hình tiếp theo
      } else {
        Alert.alert("Lỗi", result.error || "Xác thực không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại sau.");
    }
  };


  const handlePasscodeAuth = async () => {
    setLoading(true);
    try {
      const savedPasscode = await SecureStore.getItemAsync("passcode");
      if (savedPasscode === passcode) {
        Alert.alert("Thành công!", "Đăng nhập thành công.");
        router.push("/(dashBoard)/home");
      } else {
        Alert.alert("Lỗi", "Mật khẩu không đúng.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xác thực. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleBiometricAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        secureTextEntry
        value={passcode}
        onChangeText={setPasscode}
      />

      <TouchableOpacity style={styles.button} onPress={handlePasscodeAuth}>
        <Text style={styles.buttonText}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleBiometricAuth}
      >
        <Text style={styles.buttonText}>Xác thực sinh trắc học</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});