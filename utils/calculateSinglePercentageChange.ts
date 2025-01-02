export const calculateSinglePercentageChange = (
    priceUsd: number,
    changePercent: number
): number => {
    const originalPrice = priceUsd / (1 + changePercent / 100); // Giá trị đầu
    const percentageChange = ((priceUsd - originalPrice) / originalPrice) * 100; // % thay đổi
    return parseFloat(percentageChange.toFixed(2)); // Làm tròn đến 2 chữ số thập phân
};