export function formatCurrency(value: number, max: number = 2, minFraction: number = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
    minimumFractionDigits: minFraction
  }).format(value);
}