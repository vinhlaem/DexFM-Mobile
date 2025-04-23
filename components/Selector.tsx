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
import { getLogo } from "@/utils/getLogoCrypto";
import { AddressState } from "@/types/types";
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

export default function CustomSelector({
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
      {/* Selector */}
      <TouchableOpacity
        style={StyleSheet.flatten([styles.selector, selectorStyle])}
        onPress={() => setDropdownVisible(true)}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={getLogo(selectedOption.type)}
          />
        </View>

        {/* Selected Value */}
        <Text style={StyleSheet.flatten([styles.text, textStyle])}>
          {getName(selectedOption.type)}
        </Text>

        {/* Arrow */}
        <Ionicons name="chevron-down" size={20} color="#000" />
      </TouchableOpacity>

      {/* Dropdown (Modal) */}
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
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius:50
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
    width: 25,
    height: 25,
    marginRight: 8,
    borderRadius:50
  },
  dropdownText: {
    fontSize: 16,
  },
});
