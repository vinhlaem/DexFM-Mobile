import React, { useEffect, useState, useCallback, useRef } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import ItemToken from "./ItemToken";
import FilterCoin from "./FilterCoin";
import { getTokenDetail, getTokenDetailFromCoinGecko, getTrandingTokens } from "@/api/token";
import { TokenDetail, TokenInfo } from "@/types/tokenType";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Favorites } from "@/store/favoriteSlice";
import { router } from "expo-router";

export default function ListFavorites() {
    const [coins, setCoins] = useState<TokenDetail[]>([]);
    const [loading, setLoading] = useState(true);
    
    const fetchedTokensRef = useRef<Set<string>>(new Set());
  
    const favorites = useSelector((state: RootState) => state.favorites.favorites);
  
  
    const fetchCoins = useCallback(
      async (chainId: string, token_address: string) => {
        const tokenKey = `${chainId}:${token_address}`;
        if (fetchedTokensRef.current.has(tokenKey)) {
          return;
        }
  
        setLoading(true);
        try {
          let data = await getTokenDetail({ chainId, token_address });
  
          if (!data) {
            data = await getTokenDetailFromCoinGecko({ chainId, token_address });
          }
  
          setCoins((prev) => {
            const exists = prev.some(
              (coin) =>
                coin.baseToken.address === data.baseToken.address &&
                coin.chainId === data.chainId
            );
            if (exists) {
              return prev;
            }
            return [...prev, data];
          });
  
          fetchedTokensRef.current.add(tokenKey);
        } catch (error: any) {
          console.error("Error fetchCoins: ", error.message);
        } finally {
          setLoading(false);
        }
      },
      [] 
    );
  
    useEffect(() => {
      const fetchAllCoins = async () => {
        if (favorites.length === 0) {
          setCoins([]);
          fetchedTokensRef.current.clear();
          setLoading(false);
          return;
        }
  
        setLoading(true);
        try {
          const promises = favorites.map((favorite: Favorites) =>
            fetchCoins(favorite.chain_id, favorite.token_address)
          );
          await Promise.all(promises);
  
          setCoins((prev) =>
            prev.filter((coin) =>
              favorites.some(
                (fav: Favorites) =>
                  fav.token_address === coin.baseToken.address &&
                  fav.chain_id === coin.chainId
              )
            )
          );
  
          const newFetchedTokens = new Set<string>();
          favorites.forEach((fav: Favorites) => {
            const tokenKey = `${fav.chain_id}:${fav.token_address}`;
            if (fetchedTokensRef.current.has(tokenKey)) {
              newFetchedTokens.add(tokenKey);
            }
          });
          fetchedTokensRef.current = newFetchedTokens;
        } catch (error) {
          console.error("Error fetching all coins:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllCoins();
    }, [favorites, fetchCoins]);


  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000000" />
        </View>
      )}
      {!loading && coins.length !== 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={coins}
          keyExtractor={(item) => item.baseToken.name + item.baseToken.address}
          renderItem={({ item }) => (
            <ItemToken
              chainId={item.chainId}
              iconUrl={item.info.imageUrl}
              name={item.baseToken.name}
              symbol={item.baseToken.symbol}
              price={parseFloat(item.priceUsd)}
              change={item.priceChange.h24 ?? 0}
              pair_address={item.pairAddress}
              token_address={item.baseToken.address}
            />
          )}
        />
      )}
      {coins.length === 0 && !loading && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.aboutTitle}>No favorites</Text>
        <Text onPress={() => router.back()}>Back</Text>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
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
    margin: "auto",
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});