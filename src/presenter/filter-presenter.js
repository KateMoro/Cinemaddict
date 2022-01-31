import { render, remove, replace } from '../utils/render.js';
import { FilterType, UpdateType } from '../utils/const.js';
import { filter } from '../utils/filter.js';

import ProfileView from '../view/profile-view.js';
import MainNavigationView from '../view/main-navigation-view.js';

export default class FilterPresenter {
  #profileContainer = null;
  #filterContainer = null;

  #filmsModel = null;
  #filterModel = null;

  #profileComponent = null;
  #filterComponent = null;

  constructor(profileContainer, filterContainer, filmsModel, filterModel) {
    this.#profileContainer = profileContainer;
    this.#filterContainer = filterContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  get watchedFilms() {
    return this.filters.find((item) => item.type === FilterType.HISTORY).count;
  }

  init = () => {
    const prevProfileComponent = this.#profileComponent;
    const prevFilterComponent = this.#filterComponent;

    this.#profileComponent = new ProfileView(this.watchedFilms);

    this.#filterComponent = new MainNavigationView(this.filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeClick);

    if (prevProfileComponent === null && prevFilterComponent === null) {
      render(this.#profileContainer, this.#profileComponent);
      render(this.#filterContainer, this.#filterComponent);
      return;
    }

    replace(this.#profileComponent, prevProfileComponent);
    replace(this.#filterComponent, prevFilterComponent);

    remove(prevProfileComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeClick = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
