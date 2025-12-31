import React, { memo, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { formatCurrency } from "@/utils/formatCurrency";
import { router } from "expo-router";
import CustomImage from "../ImageCustomer";
import { LinearGradient } from "react-native-svg";
import DefaultLogo from "../ui/DefaulfLogo";
import RenderPrice from "../ui/RenderPrice";
import { Ionicons } from "@expo/vector-icons";
import { renderChangePrice } from "@/utils/cryptoUtils";
import PriceChange from "../ui/PriceChange";
import { renderName } from "@/utils/string";

type CustomItemTokenProps = {
    iconUrl: string; // Đường dẫn ảnh
    name: string; // Tên đồng tiền
    symbol: string; // Ký hiệu
    price: number; // Giá
    change: number; // Thay đổi phần trăm
    pair_address?: string;
    chainId: string
    token_address: string
};

const ItemToken = memo(({ iconUrl, name, symbol, price, change, pair_address, chainId , token_address }: CustomItemTokenProps) => {
    const isPositive = change >= 0;

    const handleShowDetail = useCallback(() => {
        router.push({
            pathname: '/(detailToken)',
            params: {
                pair_address: pair_address,
                chainId: chainId,
                token_address: token_address
            }
        })
    }, [pair_address]);

    return (
        <Pressable
            style={styles.container}
            onPress={handleShowDetail}
        >
           {iconUrl ? <CustomImage source={iconUrl} size={40} width={40} height={40} /> : <DefaultLogo symbol={symbol.slice(0, 1)} />}

            <View style={styles.infoContainer}>
                <Text style={styles.name}>{renderName
                (name, 20)}</Text>
                <Text style={styles.symbol}>{symbol}</Text>
            </View>

            <View style={styles.priceContainer}>
                {price ? <RenderPrice normalFontWeight price={String(price)} /> : <Text style={styles.price}>0</Text>}
                <PriceChange change={change} />
            </View>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 0.3,
        borderBottomColor: "#f0f0f0",
        width: '90%',
        // backgroundColor: 'orange',
        margin: 'auto'
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        boxShadow: '0px 2px 10px 0px #2B2D3333'
    },
    fallbackIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        marginStart: 10
    },
    name: {
        fontSize: 17,
        fontWeight: "600",
    },
    symbol: {
        fontSize: 14,
        color: "#888",
    },
    marketCap: {
        fontSize: 12,
        color: "#aaa",
    },
    priceContainer: {
        alignItems: "flex-end",
    },
    price: {
        fontSize: 17,
        fontWeight: "500",
    },
    change: {
        fontSize: 14,
    },
});

export default memo(ItemToken);