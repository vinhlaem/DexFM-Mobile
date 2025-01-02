export const formatAbbreviatedNumber = (value: number): string => {
    if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(1)}B`; // Tỷ (Billion)
    } else if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`; // Triệu (Million)
    } else if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`; // Nghìn (Thousand)
    }
    return `$${value.toFixed(1)}`; // Số nhỏ hơn 1,000
};