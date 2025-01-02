import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import ItemToken from "./ItemToken";
import FilterCoin from "./FilterCoin";
import { getTrandingTokens } from "@/api/token";
import { TokenInfo } from "@/types/tokenType";

export default function ListToken() {
    const [coins, setCoins] = useState<TokenInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState("solana");

    const handleSetFilter = useCallback((value: string) => setSelectedFilter(value), []);

    useEffect(() => {
        setLoading(true);
    }, [selectedFilter]);

    const fetchCoins = useCallback(async () => {
        const data = await getTrandingTokens(selectedFilter);
        setCoins(data);
        setLoading(false);
    }, [selectedFilter]);

    useEffect(() => {
        fetchCoins();
    }, [fetchCoins]);

    useEffect(() => {
        const intervalId = setInterval(fetchCoins, 10000);

        return () => clearInterval(intervalId);
    }, [fetchCoins]);

    return (
        <View style={styles.container}>
            <View style={styles.trendingSection}>
                <Text style={styles.trendingTitle}>🔥 Trending</Text>
                <FilterCoin selectedFilter={selectedFilter} setSelectedFilter={handleSetFilter} />
            </View>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#000000" />
                </View>
            )}
            {!loading && coins.length !== 0 && (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={coins}
                    keyExtractor={(item) => item.name + item.h1}
                    renderItem={({ item }) => (
                        <ItemToken
                            chainId={item.chain}
                            iconUrl={item.image}
                            name={item.name}
                            symbol={item.symbol}
                            price={parseFloat(item.price)}
                            change={item.h24}
                            pair_address={item.pair_address}
                        />
                    )}
                />
            )}
            {coins.length === 0 && !loading && (
                <View style={styles.loadingContainer}>
                    <Text>No data!</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // paddingHorizontal: 16,
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    trendingSection: {
        marginVertical: 20,
        maxHeight: 70,
        width: "90%",
        margin: 'auto'
    },
    trendingTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
});