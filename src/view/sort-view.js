import AbstractView from './abstract-view.js';
import { SortType } from '../utils/const.js';

const createSortTemplate = () => (`
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>
`);

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }

  #changeActiveClass = (target) => {
    const buttons = this.element.querySelectorAll('.sort__button');
    buttons.forEach((button) => button.classList.remove('sort__button--active'));
    target.classList.add('sort__button--active');
  }

  #sortTypeChangeHandler = (evt) => {
    const target = evt.target;

    if (target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this.#changeActiveClass(target);
    this._callback.sortTypeChange(target.dataset.sortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }
}
