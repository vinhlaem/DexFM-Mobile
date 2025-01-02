export const getName = (accountType: string): string => {
    switch (accountType) {
        case 'Ethereum Account':
            return 'ETH';
        case 'Solana Account':
            return 'SOL';
        default:
            return 'ERROR';
    }
};


export const getNameShareAddress = (accountType: string): string => {
    switch (accountType) {
        case 'Ethereum Account':
            return 'ETH Address (Ethereum)';
        case 'Solana Account':
            return 'SOL Address (Solana)';
        default:
            return 'ERROR';
    }
};