
import { Favorites } from "@/store/favoriteSlice";
import * as SecureStore from "expo-secure-store";

const FAVORITES_KEY = "favorites";

const getFavorites = async (): Promise<Favorites[]> => {
  try {
    const favoritesJson = await SecureStore.getItemAsync(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error: any) {
    throw new Error("Error get favorites: " + error.message);
  }
};

const saveFavorites = async (favorites: Favorites[]): Promise<void> => {
  try {
    await SecureStore.setItemAsync(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error: any) {
    throw new Error("Error save favorites: " + error.message);
  }
};

const clearFavorites = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(FAVORITES_KEY);
  } catch (error: any) {
    throw new Error("Error clear favorites: " + error.message);
  }
};

export const favoritesService = {
  getFavorites,
  saveFavorites,
  clearFavorites,
};