import { createElement } from '../render.js';

const createFooterStatisticsTemplate = () => (`
  <p>130 291 movies inside</p>
`);

export default class FooterStatisticsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterStatisticsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
