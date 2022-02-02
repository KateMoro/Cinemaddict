import { FilterType } from '../utils/const.js';
import AbstractView from './abstract-view.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmsTemplate = (filterType) => (`
  <section class="films-list">
    <h2 class="films-list__title">${NoFilmsTextType[filterType]}</h2>
  </section>
`);

export default class NoFilmsView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoFilmsTemplate(this._data);
  }
}
