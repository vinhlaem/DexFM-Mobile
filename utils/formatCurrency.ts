

// import BigNumber from 'bignumber.js';

// import { THRESHOLD } from '@/constants';

export function formatCurrency(value: number, max: number = 2, minFraction: number = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
    minimumFractionDigits: minFraction
  }).format(value);
}



export const convertToNumber = (value?: number | string | string[]): number => {
  return Number(value) || 0;
};

// export const formatCurrency = (value: number) => {
//   return value.toLocaleString('en-US', {
//     style: 'currency',
//     currency: 'USD',
//   });
// };

export const formatCash = (n?: number) => {
  const number = convertToNumber(n);

  const nABS = Math.abs(number);

  if (nABS < 1e3) return number;
  if (nABS >= 1e3 && nABS < 1e6) return `${+(number / 1e3).toFixed(1)}K`;
  if (nABS >= 1e6 && nABS < 1e9) return `${+(number / 1e6).toFixed(1)}M`;
  if (nABS >= 1e9 && nABS < 1e12) return `${+(number / 1e9).toFixed(1)}B`;
  if (nABS >= 1e12) return `${+(number / 1e12).toFixed(1)}T`;
  return 0;
};

export const toFixed = (n: number | undefined, count: number): string => {
  const number = convertToNumber(n);
  return toLocaleString(Number(number.toFixed(count)));
};

export const toFixedPercent = (n?: number | string): string => {
  const number = convertToNumber(n);
  return toLocaleString(Number(number.toFixed(2)));
};

export const toLocaleString = (n?: number) => {
  const number = convertToNumber(n);
  return number.toLocaleString();
};

export const isPositiveNumbers = (n?: number) => {
  const number = convertToNumber(n);
  return number >= 0;
};

export const countZeroDecimal = (n?: number): number => {
  let countZeros = 0;
  const numStr = Number(n).toString();
  const arrNumber = numStr.split('.');
  const decimalPart = arrNumber.length > 1 ? arrNumber[1] : [];
  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] === '0') {
      countZeros++;
    } else {
      break;
    }
  }
  return countZeros;
};

export const isDecimal = (n?: number): boolean => {
  return Number(n) % 1 !== 0;
};

export const isExponential = (n?: number): boolean => {
  const regex = /e/;
  const numStr = Number(n).toString();
  return regex.test(numStr);
};

export const convertScientificToDecimal = (number: number) => {
  const base = 10;
  const exponent = Math.floor(Math.log10(Math.abs(number))) + 1;
  const decimal = number * Math.pow(base, -exponent);
  return decimal;
};

export const toFormattedNumber = (
  n?: number | string,
  isChangePrice?: boolean,
  fixedNumber?: boolean
): string => {
  let number = convertToNumber(n);
  if (isExponential(number)) {
    number = convertScientificToDecimal(number);
  }
  if (isDecimal(number)) {
    const countZeros = countZeroDecimal(number);

    const count =
      isChangePrice || countZeros == 0
        ? countZeros + (fixedNumber ? 0 : 2)
        : countZeros + 4;

    const formattedNumber = `${number
      .toFixed(count)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    return formattedNumber;
  }
  return number.toLocaleString();
};

export const toFormatted = (
  n?: number | string,
  isChangePrice?: boolean
): number => {
  let number = convertToNumber(n);
  if (isExponential(number)) {
    number = convertScientificToDecimal(number);
  }
  if (isDecimal(number)) {
    const countZeros = countZeroDecimal(number);
    const count =
      isChangePrice || countZeros == 0 ? countZeros + 2 : countZeros + 4;
    const formattedNumber = number.toFixed(count);
    return Number(formattedNumber);
  }
  return number;
};

export const formatPrice = (value: number) => {
  return value > 1.1
    ? toFixedPercent(value)
    : toFormattedNumber(value, true);
};

export const kFormatter = (num: number) => {
  return Math.abs(num) > 999
    ? Math.sign(num) * +(Math.abs(num) / 1000).toFixed(1) + 'K'
    : Math.sign(num) * Math.abs(num);
};

export default function formatNumber(num: number, precision = 0) {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) > x.threshold);
  if (found) {
    if (num > 999499 && num < 1000000) {

      const formatted = num / found.threshold + found.suffix;
      return formatted;
    }
    if (num > 999499000 && num < 1000000000) {
      
      const formatted = num / found.threshold + found.suffix;
      return formatted;
    } else {

      const formatted =
        (num / found.threshold).toFixed(precision) + found.suffix;
      return formatted;
    }
  }

  return num;
}

// export const convertBigNumber = (number: number, precision?: number) => {
//   return new BigNumber(number).precision(precision || 6).toFormat();
// };

// export const convert_USD = (val: number, coinPrice: number) => {
//   if (val.toString() === 'NaN') {
//     return 0;
//   }
//   return BigNumber(val * coinPrice)
//     .dp(3, BigNumber.ROUND_DOWN)
//     .toNumber();
// };

// export const convertGasPrice = (value: number) => {
//   const number = new BigNumber(10);

//   const bìgNumber = number.exponentiatedBy(18);
//   const gasPrice = new BigNumber(value);

//   return (
//     Number(gasPrice.dividedBy(bìgNumber).toNumber()) * 1000000000
//   ).toFixed();
// };

export const parse = (val: number) => Number(val.toString().replace(/^\$/, ''));
