import AbstractView from './abstract-view.js';

const createLoadMoreButtonTemplate = () => (`
  <button class="films-list__show-more">Show more</button>
`);

export default class LoadMoreButtonView extends AbstractView {
  get template() {
    return createLoadMoreButtonTemplate();
  }

  setButtonClickHandler = (callback) => {
    this._callback.buttonClick = callback;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.buttonClick();
  }
}
