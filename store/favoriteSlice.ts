// store/favoritesSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./index";
import { GeneralStatus } from "@/types/types";
import { favoritesService } from "@/services/favorite";


export type Favorites = {   
  token_address: string;
  chain_id: string; 
};
// Định nghĩa interface cho state của favorites
interface FavoritesState {
  favorites: Favorites[]; // Sử dụng kiểu Favorites thay vì string[]
  status: GeneralStatus;
  error: string | null;
}

// Trạng thái ban đầu
const initialState: FavoritesState = {
  favorites: [],
  status: GeneralStatus.Idle,
  error: null,
};

// Async thunk để tải danh sách yêu thích từ service
export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await favoritesService.getFavorites();
      return favorites;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk để lưu danh sách yêu thích qua service
export const saveFavorites = createAsyncThunk(
  "favorites/saveFavorites",
  async (favorites: Favorites[], { rejectWithValue }) => {
    try {
      await favoritesService.saveFavorites(favorites);
      return favorites;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk để xóa danh sách yêu thích
export const clearFavorites = createAsyncThunk(
  "favorites/clearFavorites",
  async (_, { rejectWithValue }) => {
    try {
      await favoritesService.clearFavorites();
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Tạo slice cho favorites
export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Thêm một token vào danh sách yêu thích
    addFavorite: (state, action: PayloadAction<Favorites>) => {
      const exists = state.favorites.some(
        (fav) =>
          fav.token_address === action.payload.token_address &&
          fav.chain_id === action.payload.chain_id
      );
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    // Xóa một token khỏi danh sách yêu thích
    removeFavorite: (state, action: PayloadAction<Favorites>) => {
      state.favorites = state.favorites.filter(
        (fav) =>
          !(
            fav.token_address === action.payload.token_address &&
            fav.chain_id === action.payload.chain_id
          )
      );
    },
    // Reset danh sách yêu thích
    resetFavorites: (state) => {
      state.favorites = [];
      state.status = GeneralStatus.Idle;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.status = GeneralStatus.Loading;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.status = GeneralStatus.Idle;
        state.error = null;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.status = GeneralStatus.Failed;
        state.error = action.payload as string;
      })
      .addCase(saveFavorites.pending, (state) => {
        state.status = GeneralStatus.Loading;
        state.error = null;
      })
      .addCase(saveFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.status = GeneralStatus.Idle;
        state.error = null;
      })
      .addCase(saveFavorites.rejected, (state, action) => {
        state.status = GeneralStatus.Failed;
        state.error = action.payload as string;
      })
      .addCase(clearFavorites.pending, (state) => {
        state.status = GeneralStatus.Loading;
        state.error = null;
      })
      .addCase(clearFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.status = GeneralStatus.Idle;
        state.error = null;
      })
      .addCase(clearFavorites.rejected, (state, action) => {
        state.status = GeneralStatus.Failed;
        state.error = action.payload as string;
      });
  },
});

// Xuất các action
export const { addFavorite, removeFavorite, resetFavorites } = favoritesSlice.actions;

// Selector để lấy danh sách yêu thích từ state
export const selectFavorites = (state: RootState) => state.favorites.favorites;

export default favoritesSlice.reducer;