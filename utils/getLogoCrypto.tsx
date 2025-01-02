export const getLogo = (accountType: string): string => {
    switch (accountType) {
        case 'Ethereum Account':
            return 'https://cryptologos.cc/logos/ethereum-eth-logo.png';
        case 'Solana Account':
            return 'https://cryptologos.cc/logos/solana-sol-logo.png';
        default:
            return 'https://via.placeholder.com/50';
    }
};