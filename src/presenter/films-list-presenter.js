import { updateItem } from '../utils.js';
import { render, remove } from '../render.js';

import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';

import FilmCardPresenter from './film-card-presenter.js';

const CARD_COUNT_PER_STEP = 5;

export default class FilmsListPresenter {
  #filmsContainer = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #noFilmsComponent = new NoFilmsView();
  #loadMoreButtonComponent = new LoadMoreButtonView();

  #filmsList = [];
  #renderedFilmCardCount = CARD_COUNT_PER_STEP;
  #filmCardPresenter = new Map();

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = (filmsList) => {
    this.#filmsList = [...filmsList];

    render(this.#filmsContainer, this.#filmsComponent);
    render(this.#filmsComponent, this.#filmsListComponent);
    render(this.#filmsListComponent, this.#filmsListContainerComponent);
    this.#renderFilms();
  }

  #renderFilmCard = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListContainerComponent, this.#handleFilmChange);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  }

  #renderFilmsList = (from, to) => {
    this.#filmsList
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film));
  }

  #clearFilmsList = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    this.#renderedFilmCardCount = CARD_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #renderNoFilms = () => {
    render(this.#filmsComponent, this.#noFilmsComponent);
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilmsList(this.#renderedFilmCardCount, this.#renderedFilmCardCount + CARD_COUNT_PER_STEP);
    this.#renderedFilmCardCount += CARD_COUNT_PER_STEP;

    if (this.#renderedFilmCardCount >= this.#filmsList.length) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #handleFilmChange = (updatedFilm) => {
    this.#filmsList = updateItem(this.#filmsList, updatedFilm);
    this.#filmCardPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #renderLoadMoreButton = () => {
    render(this.#filmsListComponent, this.#loadMoreButtonComponent);
    this.#loadMoreButtonComponent.setButtonClickHandler(this.#handleLoadMoreButtonClick);
  }

  #renderFilms = () => {
    if (this.#filmsList.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilmsList(0, Math.min(this.#filmsList.length, CARD_COUNT_PER_STEP) );

    if (this.#filmsList.length > CARD_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }
}
