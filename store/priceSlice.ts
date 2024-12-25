import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GeneralStatus } from "@/types/types";
import { fetchCryptoPrices } from "@/utils/fetchCryptoPrices";
import { FETCH_PRICES_INTERVAL } from "@/services/price";

export const fetchPrices = createAsyncThunk(
  "price/fetchPrices",
  async (_, { getState }: any) => {
    const { lastUpdated } = getState().price;
    const currentTime = new Date().getTime();

    if (currentTime - lastUpdated < FETCH_PRICES_INTERVAL) {
      const dataPrices = await AsyncStorage.getItem("prices");

      if (dataPrices) {
        const data = JSON.parse(dataPrices);
        return data;
      } else {
        console.warn("No prices data found in AsyncStorage.");
        return null;
      }
    }

    const data = await fetchCryptoPrices();
    await AsyncStorage.setItem("prices", JSON.stringify(data));
    return data;
  }
);

export interface CryptoPrices {
  ethereum: {
    usd: number;
  };
  solana: {
    usd: number;
  };
}

export interface PriceState {
  data: CryptoPrices;
  lastUpdated: number;
  status: GeneralStatus;
}

const initialState = {
  data: {
    ethereum: {
      usd: 0,
    },
    solana: {
      usd: 0,
    },
  },
  lastUpdated: 0,
  status: GeneralStatus.Idle,
};

const priceSlice = createSlice({
  name: "prices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrices.fulfilled, (state, action) => {
        state.data = action.payload;
        state.lastUpdated = new Date().getTime();
        state.status = GeneralStatus.Success;
      })
      .addCase(fetchPrices.pending, (state) => {
        state.status = GeneralStatus.Loading;
      })
      .addCase(fetchPrices.rejected, (state) => {
        state.status = GeneralStatus.Failed;
      });
  },
});

export default priceSlice.reducer;
