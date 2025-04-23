import { renderChangePrice } from "@/utils/cryptoUtils";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function PriceChange({ change }: { change: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {change != 0 && <Text
        style={{
          color: renderChangePrice(change),
          marginTop: 2,
        }}
      >
        <Ionicons
          name={
              change > 0
              ? "arrow-up"
              : "arrow-down"
          }
        />
      </Text>}
      <Text style={{ color: renderChangePrice(change), marginTop: 2 }}>
        {change.toFixed(2).replace(/^-/, '')}%
      </Text>
    </View>
  );
}

