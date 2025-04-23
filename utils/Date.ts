import dayjs from 'dayjs'; // Default import instead of namespace import
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const date = new Date();

// Get hour range (e.g., "13:00-14:00")
export const getHourRange = (dateTime?: string) => {
  const timestamp = dayjs.utc(dateTime || undefined, 'YYYY-MM-DD HH:mm:ss'); // Handle undefined case
  const current = timestamp.local().hour();
  const next = timestamp.local().add(1, 'hour').hour(); // Use 'hour' instead of 'h'
  return `${current}:00-${next}:00`;
};

// Get yesterday's date
export const getYesterday = () => {
  const currentDate = dayjs.utc();
  return currentDate.subtract(1, 'day');
};

// Format a date with a specific string format
export const formatDate = (
  date: number | string | Date,
  stringFormat: string
) => {
  return dayjs.utc(date).format(stringFormat);
};

// Format the current date (using the constant `date`)
export const formatDateCurrent = (stringFormat: string) => {
  return formatDate(date, stringFormat);
};

// Format date for chart (e.g., "DD/MM/YYYY")
export const formatDateChart = (date: number | string) => {
  return formatDate(new Date(date), 'DD/MM/YYYY');
};

// Format date for pair (e.g., "MM/DD/YYYY")
export const formatDatePair = (date: number | string) => {
  return formatDate(new Date(date), 'MM/DD/YYYY');
};

// Get relative time (e.g., "2 hours ago")
export const fromNow = (date: string | number) => {
  return dayjs.utc(date).fromNow();
};

// Subtract time from a date
export const subtractTime = (
  date: Date,
  count: number,
  time?: dayjs.ManipulateType
) => {
  const currentDate = dayjs.utc(date);
  return currentDate.subtract(count, time);
};

// Round date to the start of the hour
export const roundedDate = () => {
  const currentDate = dayjs.utc();
  const roundedDate = currentDate.startOf('hour');
  const formattedDate = roundedDate.format('YYYY-MM-DD HH:mm:ss');
  return formattedDate;
};