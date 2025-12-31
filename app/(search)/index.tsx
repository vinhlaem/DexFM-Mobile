import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useDebounce from "@/hooks/useDebounce";
import { getSearchTokens, getTopTokens } from "@/api/token";
import { FlatList } from "react-native-gesture-handler";
import { TokenDetail } from "@/types/tokenType";
import ItemToken from "@/components/home/ItemToken";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function Search() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<TokenDetail[]>([]);
  const [topTokens, setTopTokens] = useState<TokenDetail[]>([]);
  const debouncedSearch = useDebounce(search, 500);
  const insets = useSafeAreaInsets();



  const getTokens = async () => {
    try {
      const topTokens = await getTopTokens();
      setTopTokens(topTokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getTokens();

    const intervalId = setInterval(() => {
      getTokens();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);


  const handleSearch = async () => {
    const searchResults = await getSearchTokens(search);
    setSearchResults(searchResults);
    setIsLoading(false);
  };

  useEffect(() => {
    if (debouncedSearch.length > 0) {
      setIsLoading(true);
      handleSearch();
    }
  }, [debouncedSearch]);


  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.headerContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color="#535353" />
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            placeholder="Search tokens"
            placeholderTextColor="#999"
          />
        </View>
        <Ionicons
          name="close"
          size={25}
          color="#535353"
          style={{ cursor: "pointer" }}
          onPress={() => router.back()}
        />
      </View>
      <View style={styles.searchContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : searchResults.length == 0 && search.length > 0 ? (
          <View style={styles.loadingContainer}>
            <Text>No results</Text>
          </View>
        ) : searchResults.length > 0 && search.length > 0 ? (
          <View>
            <Text style={styles.topTokensTitle}>Results</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <ItemToken
                  chainId={item.chainId}
                  iconUrl={item.info?.imageUrl ?? ""}
                  name={item.baseToken?.name ?? ""}
                  symbol={item.baseToken?.symbol ?? ""}
                  price={parseFloat(item.priceUsd ?? "0")}
                  change={item.priceChange.h24 ?? 0}
                  pair_address={item.pairAddress ?? ""}
                  token_address={item.baseToken.address ?? ""}
                />
              )}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.topTokensTitle}>Top Tokens</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={topTokens}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <ItemToken
                  chainId={item.chainId}
                  iconUrl={item.info?.imageUrl ?? ""}
                  name={item.baseToken?.name ?? ""}
                  symbol={item.baseToken?.symbol ?? ""}
                  price={parseFloat(item.priceUsd ?? "0")}
                  change={item.priceChange.h24 ?? 0}
                  pair_address={item.pairAddress ?? ""}
                  token_address={item.baseToken.address ?? ""}
                />
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "90%",
    alignSelf: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    height: 40,
    paddingLeft: 20,
    borderRadius: 20,
    overflow: "hidden",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0px 6px 16px 0px #2B2D3314",
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },

  searchContainer: {
    flex: 1,
    // backgroundColor: "red",
    marginTop: 20,
  },
  topTokensTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
