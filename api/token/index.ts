import { TokenDetail, TokenInfo } from '@/types/tokenType';
import axios from 'axios';

const BASE_URL = 'https://dexfmbe.azurewebsites.net/v1'

export const getTrandingTokens = async (payload: string): Promise<NonNullable<TokenInfo[]>> => {
    try {
        const response = await axios.get(`${BASE_URL}/tokens-trending?network=${payload}`);
        return response.data;
    } catch (error) {
        console.log("error getTrandingTokens: ", { error });
        return [];
    }
}

export const getTokenDetail = async (payload: any): Promise<NonNullable<TokenDetail>> => {
    const { pair_address, chainId } = payload;
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pair_address}`);
    return response.data.pair;
};