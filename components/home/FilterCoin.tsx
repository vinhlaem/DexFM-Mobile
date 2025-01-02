import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

const filters = [
    { id: 2, label: "SOL", value: "solana" },
    { id: 1, label: "ETH", value: "eth" },
    { id: 3, label: "BSC", value: "bsc" },
    { id: 4, label: "Base", value: "base" },
    { id: 5, label: "Arbitrum", value: "arbitrum" },
    { id: 6, label: "Avalenche", value: "avax" },
];

type FilterCoinProps = {
    selectedFilter?: string;
    setSelectedFilter: (value: string) => void;
};

const FilterCoin = React.memo(({ selectedFilter, setSelectedFilter }: FilterCoinProps) => {
    
    const renderFilterItem = ({ item }: { item: typeof filters[0] }) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                selectedFilter === item.value && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(item.value)}
        >
            <Text
                style={[
                    styles.filterText,
                    selectedFilter === item.value && styles.activeFilterText,
                ]}
            >
                ✦ {item.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={filters}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderFilterItem}
            contentContainerStyle={styles.filters}
            showsHorizontalScrollIndicator={false}
        />
    );
});

export default FilterCoin;

const styles = StyleSheet.create({
    filters: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
    },
    filterButton: {
        backgroundColor: "#F4F5F8",
        borderRadius: 16,
        minWidth: 70,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        paddingHorizontal: 4
    },
    filterText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#000",
    },
    activeFilterButton: {
        backgroundColor: "black",
    },
    activeFilterText: {
        color: "white",
    },
});