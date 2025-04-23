import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { getLogo } from '@/utils/getLogoCrypto';
// import { getName } from '@/utils/getNameCrypto';
import { TokenDetail } from "@/types/tokenType";
import { AddressState } from "@/types/types";
import { getLogo } from "@/utils/getLogoCrypto";
import { getName } from "@/utils/getNameCrypto";

interface CustomSelectorProps {
  options: AddressState[];
  setSelectedOption: (value: AddressState) => void;
  selectedOption: AddressState;
  containerStyle?: ViewStyle;
  selectorStyle?: ViewStyle;
  textStyle?: TextStyle;
  dropdownStyle?: ViewStyle;
  dropdownItemStyle?: ViewStyle;
  dropdownTextStyle?: TextStyle;
}

export default function SelectorToken({
  options,
  setSelectedOption,
  selectedOption,
  containerStyle,
  selectorStyle,
  textStyle,
  dropdownStyle,
  dropdownItemStyle,
  dropdownTextStyle,
}: CustomSelectorProps) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (option: AddressState) => {
    setSelectedOption(option);
    setDropdownVisible(false);
  };

  return (
    <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      <TouchableOpacity
        style={StyleSheet.flatten([styles.selector, selectorStyle])}
        onPress={() => setDropdownVisible(true)}
      >
        <View style={styles.tokenContainer}>
          <Image
            source={getLogo(selectedOption.type)}
            style={styles.icon}
          />

          <View>
            <Text style={StyleSheet.flatten([styles.text, textStyle])}>
              {getName(selectedOption.type)}
            </Text>

            <Text style={styles.maxText}>Max: 21.24 UNI / ~$351.94 </Text>
          </View>
        </View>

        <Ionicons name="chevron-down" size={20} color="#888" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={isDropdownVisible}
        animationType="slide"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={StyleSheet.flatten([styles.dropdown, dropdownStyle])}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.address}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={StyleSheet.flatten([
                    styles.dropdownItem,
                    dropdownItemStyle,
                  ])}
                  onPress={() => handleSelect(item)}
                >
                  <View style={styles.dropdownItemContent}>
                    <Image
                      source={getLogo(item.type)}
                      style={styles.dropdownIcon}
                    />
                    <Text
                      style={StyleSheet.flatten([
                        styles.dropdownText,
                        dropdownTextStyle,
                      ])}
                    >
                      {getName(item.type)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#f5f5f5",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: "#E5E5E5",
    borderTopWidth: 1,
    width: "100%",
    justifyContent:'space-between'
  },
  tokenContainer: {
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection:'row',
    gap:8
  },
  icon: {
    width: 37,
    height: 37,
    borderRadius:100
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 200,
    paddingVertical: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius:100
  },
  dropdownText: {
    fontSize: 16,
  },

  label: {
    fontSize: 16,
    color: "#333",
    alignSelf: "flex-start",
  },
  maxText: {
    fontSize: 14,
    color: "#888",
  },
});
