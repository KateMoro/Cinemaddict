/* eslint-disable no-console */
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import dayjs from 'dayjs';

import { getUserRank } from '../utils/common.js';
import { StatisticFilterType } from '../utils/const.js';
import { statisticFilter, getTotalDuration, getAllGenres, countFilmsByGenre, sortGenres } from '../utils/statistic.js';

import SmartView from './smart-view.js';

const BAR_HEIGHT = 50;
const ONE_HOUR_MINUTES = 60;

const renderGenresChart = (statisticCtx, films) => {

  const allFilmGenres = getAllGenres(films);
  const uniqGenres = sortGenres(countFilmsByGenre(allFilmGenres)).map((item) => item[0]);
  const genreCounts = sortGenres(countFilmsByGenre(allFilmGenres)).map((item) => item[1]);

  statisticCtx.height = BAR_HEIGHT * uniqGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqGenres,
      datasets: [{
        data: genreCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (watchedFilms, films, statsFilters, currentFilterType) => {

  const totalDuration = getTotalDuration(films);
  const hours = Math.trunc(totalDuration / ONE_HOUR_MINUTES);
  const mins = totalDuration % ONE_HOUR_MINUTES;
  const allFilmGenres = getAllGenres(films);

  let topGenre;
  if (allFilmGenres) { topGenre = sortGenres(countFilmsByGenre(allFilmGenres))[0][0]; }


  const createStatisticFilterTemplate = (filters, currentFilter) => filters.map(({ type, name }) => `
    <input
      type="radio"
      class="statistic__filters-input visually-hidden"
      name="statistic-filter"
      id="statistic-${type}"
      value="${type}"
      ${type === currentFilter ? 'checked' : ''}>
    <label
        for="statistic-${type}"
        class="statistic__filters-label">
      ${name}
    </label>
  `);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(watchedFilms.length)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${createStatisticFilterTemplate(statsFilters, currentFilterType).join('')}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${films.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
          ${hours ? `${hours}<span class="statistic__item-description">h</span>` : ''}
          ${mins}
          <span class="statistic__item-description">m</span>
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${films.length ? topGenre : ''}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class StatisticsView extends SmartView {
  #watchedFilms = null;
  #chart = null;

  #statisticFilterType = StatisticFilterType.ALL;

  constructor(films) {
    super();
    this.#watchedFilms = films;

    this.#setInnerHandlers();
    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate(this.#watchedFilms, this.filteredFilms, this.statsFilters, this.#statisticFilterType);
  }

  get statsFilters() {
    return [
      {
        type: StatisticFilterType.ALL,
        name: 'All time',
      },
      {
        type: StatisticFilterType.TODAY,
        name: 'Today',
      },
      {
        type: StatisticFilterType.WEEK,
        name: 'Week',
      },
      {
        type: StatisticFilterType.MONTH,
        name: 'Month',
      },
      {
        type: StatisticFilterType.YEAR,
        name: 'Year',
      },
    ];
  }

  get filteredFilms() {
    return statisticFilter[this.#statisticFilterType](this.#watchedFilms);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#chart) {
      this.#chart.destroy();
      this.#chart = null;
    }
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setCharts();
  }

  #setInnerHandlers = () => {
    this.element
      .querySelector('.statistic__filters')
      .addEventListener('change', this.#dateRangeChangeHandler);
  }

  #dateRangeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#statisticFilterType = evt.target.value;
    this.updateElement();

    console.log(this.filteredFilms.map((item) => item.watchingDate));
  }

  #setCharts = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');

    this.#chart = renderGenresChart(statisticCtx, this.filteredFilms);
  }
}
