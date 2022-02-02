import AbstractView from './abstract-view.js';

const createMainNavigationItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return name === 'All movies' ?
    `<a
    href="#${type}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}">
      ${name}
    </a>`
    : `<a
      href="#${type}"
      class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
      data-filter-type="${type}">
        ${name}
        <span class="main-navigation__item-count">${count}</span>
    </a>`;
};

const createMainNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createMainNavigationItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" data-filter-type="stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};


export default class MainNavigationView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    const target = evt.target;

    if (target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(target.dataset.filterType);
  }
}
