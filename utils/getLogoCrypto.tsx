// Định nghĩa ánh xạ giữa accountType và tài nguyên hình ảnh
const logoMap: { [key: string]: any } = {
    'ethereum': require('../assets/images/eth.png'),
    'solana': require('../assets/images/solana.png'),
    default: require('../assets/images/none.png'), 
};

export const getLogo = (accountType: string): any => {
    if (!accountType) {
        return logoMap.default; 
    }

    const baseAccountType = accountType.replace(/\s*\d+$/, '');

    return logoMap[baseAccountType] || logoMap.default;
};