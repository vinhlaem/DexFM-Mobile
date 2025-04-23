import { LIST_LINK } from "@/constants/ListNetwork";

export const getName = (accountType: string): string => {

    const baseAccountType = accountType.replace(/\s*\d+$/, '');
    switch (baseAccountType) {
        case 'ethereum':
            return 'ETH';
        case 'solana':
            return 'SOL';
        default:
            return 'ERROR';
    }
};


export const getNameShareAddress = (accountType: string): string => {
    const baseAccountType = accountType.replace(/\s*\d+$/, '');

    switch (baseAccountType) {
        case 'ethereum':
            return 'Ethereum Address';
        case 'solana':
            return 'Solana Address';
        default:
            return 'ERROR';
    }
};

export const getSlugDexTool = (network: string) => {
    return LIST_LINK.find((item) => item.slug === network)?.slugDextool;
  };