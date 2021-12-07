import AbstractView from './abstract-view.js';

const createLoadMoreButtonTemplate = () => (`
  <button class="films-list__show-more">Show more</button>
`);

export default class LoadMoreButtonView extends AbstractView {
  get template() {
    return createLoadMoreButtonTemplate();
  }
}
