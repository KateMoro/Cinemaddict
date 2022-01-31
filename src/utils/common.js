import dayjs from 'dayjs';

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const getFormattedDate = (date, format) => dayjs(date).format(format);

