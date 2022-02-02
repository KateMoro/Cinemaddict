import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view.js';

const BAR_HEIGHT = 50;

const getWatchedFilms = (films) => films.filter((film) => film.isWatched);
const getTotalDuration = (films) => films.reduce((sum, item) => sum + item.runtime, 0);
const getAllGenres = (films) => films.map((film) => film.genres).flat();

const countFilmsByGenre = (genres) => genres.reduce((acc, genre) => {
  acc[genre] = (acc[genre] || 0) + 1;
  return acc;
}, {});

const sortGenres = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);


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

const createStatisticsTemplate = (films) => {

  const totalDuration = getTotalDuration(films);
  const hours = Math.trunc(totalDuration / 60);
  const mins = totalDuration % 60;
  const allFilmGenres = getAllGenres(films);
  const topGenre = sortGenres(countFilmsByGenre(allFilmGenres))[0][0];

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${films.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span>${mins}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
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

  constructor(films) {
    super();
    this.#watchedFilms = getWatchedFilms(films);

    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate(this.#watchedFilms);
  }

  #setCharts = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');

    this.#chart = renderGenresChart(statisticCtx, this.#watchedFilms);
  }
}
