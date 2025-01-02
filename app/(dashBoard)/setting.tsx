import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import IconFaceID from "@/assets/svgComponents/IconFaceID";
import { ItemSetting, ItemSettingSwitch } from "@/components/setting/ItemSetting";
import { resetEthereumState } from "@/store/ethereumSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { resetSolanaState } from "@/store/solanaSlice";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { BIOMETRICS } from "@/constants/security";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const IOS = Platform.OS === 'ios';

  const [biometrics, setBiometrics] = useState<boolean>(false);

  useEffect(() => {
    const getBiometrics = async () => {
      const biometrics = await SecureStore.getItemAsync(BIOMETRICS);
      setBiometrics(biometrics ? true : false);
    }
    getBiometrics();
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      dispatch(resetEthereumState());
      dispatch(resetSolanaState());

      await SecureStore.deleteItemAsync("mnemonic");
      await SecureStore.deleteItemAsync(BIOMETRICS);
      router.replace("/");

      console.log('Logged out successfully!');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  const updateBiometrics = useCallback(async (value: boolean) => {
    if (!value) {
      await SecureStore.deleteItemAsync(BIOMETRICS);
      // console.log("Biometrics deleted");
    } else {
      await SecureStore.setItemAsync(BIOMETRICS, "true");
      // console.log("Biometrics set");
    }
  }, []);

  useEffect(() => {
    updateBiometrics(biometrics);
  }, [biometrics]);



  return (
    <SafeAreaView style={[styles.container, { paddingTop: !IOS ? insets.top : 0 }]}>
      <Text style={styles.headerText}>Setting</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.itemContainer}>
          <Text style={styles.titleText}>Wallet setting</Text>
          <ItemSetting title="Wallet setting" onPress={() => { }} content="Wallet setting" Icon={() => <Ionicons name="wallet" size={24} color="black" />} />
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.titleText}>Preference</Text>
          <ItemSettingSwitch title="Hide small balances" onPress={() => { }} Icon={() => <Ionicons name="filter" size={24} color="black" />} />
          <ItemSettingSwitch title="Hide unknown tokens" onPress={() => { }} Icon={() => <Ionicons name="shield" size={24} color="black" />} />
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.titleText}>Security</Text>
          <ItemSettingSwitch title="Face ID" onValueChange={setBiometrics} Icon={() => <IconFaceID size={24} color="black" />} value={biometrics} />
          <ItemSetting title="Recovery pharse" onPress={() => { }} Icon={() => <Ionicons name="key" size={24} color="black" />} />
          <ItemSetting title="Icloud backup" onPress={() => { }} Icon={() => <Ionicons name="cloud" size={24} color="black" />} />
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.titleText}>Support</Text>
          <ItemSetting title="Privacy policy" onPress={() => { }} Icon={() => <Ionicons name="shield-checkmark-outline" size={24} color="black" />} />
          <ItemSetting title="Terms of service" onPress={() => { }} Icon={() => <Ionicons name="book" size={24} color="black" />} />
        </View>

        <View style={[styles.itemContainer, { marginTop: 30 }]}>
          <ItemSetting title="Sign out" onPress={() => { logout() }} Icon={() => <Ionicons name="log-out-outline" size={24} color="black" />} />

          {/* TWITTER */}

          <View style={styles.socialContainer}>
            <View style={styles.socialItem}>
              <Ionicons name="logo-instagram" size={24} color="black" />
            </View>
            <View style={styles.socialItem}>
              <Ionicons name="logo-twitter" size={24} color="black" />
            </View>
            <View style={styles.socialItem}>
              <Ionicons name="logo-tiktok" size={24} color="black" />
            </View>

          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

export default Tab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  itemContainer: {
    width: '90%',
    borderRadius: 10,
    // justifyContent: 'center',
    // flexDirection: 'row',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    color: '#7d7d7d'

  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30

  },
  contenItem: {
  },
  contentSelectedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5a5a5a',
  },
  image: {
    width: 20,
    height: 20
  },
  containerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  itemSelectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    width: '100%',
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    padding: 15
  },
  titleSelectedText: {
    fontSize: 16,
    fontWeight: '500',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20
  },
  socialItem: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  }

});
