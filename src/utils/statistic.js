import dayjs from 'dayjs';
import { StatisticFilterType } from './const.js';

export const statisticFilter = {
  [StatisticFilterType.ALL]: (films) => films.slice(),
  [StatisticFilterType.TODAY]: (films) => films.filter((film) => film.watchingDate === dayjs()),
  [StatisticFilterType.WEEK]: (films) => films.filter((film) => dayjs().diff(dayjs(film.watchingDate), 'week') === 0),
  [StatisticFilterType.MONTH]: (films) => films.filter((film) => dayjs().diff(dayjs(film.watchingDate), 'month') === 0),
  [StatisticFilterType.YEAR]: (films) => films.filter((film) => dayjs().diff(dayjs(film.watchingDate), 'year') === 0),
};

export const getTotalDuration = (films) => films.reduce((sum, item) => sum + item.runtime, 0);

export const getAllGenres = (films) => films.map((film) => film.genres).flat();

export const countFilmsByGenre = (genres) => genres.reduce((acc, genre) => {
  acc[genre] = (acc[genre] || 0) + 1;
  return acc;
}, {});

export const sortGenres = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);
