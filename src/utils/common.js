import dayjs from 'dayjs';
import { UserRank } from './const.js';

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const getFormattedDate = (date, format) => dayjs(date).format(format);

export const getUserRank = (watchedFilms) => {
  if (watchedFilms > 0 && watchedFilms <= 10) {
    return UserRank.NOVICE;
  }

  if (watchedFilms > 10 && watchedFilms <= 20) {
    return UserRank.FAN;
  }

  if (watchedFilms > 20) {
    return UserRank.MOVIE_BUFF;
  }

  return '';
};

