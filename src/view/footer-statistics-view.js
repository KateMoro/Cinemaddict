import AbstractView from './abstract-view.js';

const createFooterStatisticsTemplate = (films) => (`
  <p>${films.length} movies inside</p>
`);

export default class FooterStatisticsView extends AbstractView {
  #filmsModel  = null;

  constructor(filmsModel) {
    super();
    this.#filmsModel = filmsModel;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmsModel);
  }
}
