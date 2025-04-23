import formatNumber, { formatPrice } from "@/utils/formatCurrency";
import { Text, View } from "react-native";

interface props {
  price: string;
  normalFontWeight?: boolean;
}

export default function RenderPrice({ price, normalFontWeight = false }: props) {
  const totalZero = -Math.floor(Math.log10(Number(price)) + 1);
  if (totalZero > 4) {
    const lastNumber = Number(price.split(".").join("")) - 0;

    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 18, fontWeight: normalFontWeight ? '500' : 'bold' }}>0.0</Text>
        <Text
          style={{
            top: 7,
            fontWeight: normalFontWeight ? '500' : 'bold',
            fontSize: 13,
            position: "relative",
          }}
        >
          {totalZero}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: normalFontWeight ? '500' : 'bold' }}>{lastNumber.toString().substring(0, 4)}</Text>
      </View>
    );
  } else {
    return (
      <Text style={{ fontSize: 18, fontWeight: normalFontWeight ? '500' : 'bold' }}>
        {`${
          Number(price) > 9999
            ? formatNumber(Number(price) || 0, 2)
            : Number(price) > 1
            ? formatPrice(Number(price))
            : price
        }`}
      </Text>
    );
  }
}
