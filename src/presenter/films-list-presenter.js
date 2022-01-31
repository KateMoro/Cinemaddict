import { render, remove, RenderPosition } from '../utils/render.js';
import { SortType, FilterType, UpdateType, UserAction } from '../utils/const.js';
import { filter } from '../utils/filter.js';

import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import LoadingView from '../view/loading-view.js';

import FilmCardPresenter from './film-card-presenter.js';

const FILM_COUNT_PER_STEP = 5;
export default class FilmsListPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filterModel = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #loadingComponent = new LoadingView();

  #noFilmsComponent = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;

  #renderedFilmCardCount = FILM_COUNT_PER_STEP;
  #filmCardPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(filmsContainer, filmsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort((a, b) => b.releaseDate - a.releaseDate);
      case SortType.RATING:
        return filteredFilms.sort((a, b) => b.totalRating - a.totalRating);
    }

    return filteredFilms;
  }

  init = () => {
    render(this.#filmsContainer, this.#filmsComponent);
    render(this.#filmsComponent, this.#filmsListComponent);
    render(this.#filmsListComponent, this.#filmsListContainerComponent);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderFilms();
  }

  destroy = () => {
    this.#clearFilms({resetRenderedFilmCardCount: true, resetSortType: true});

    remove(this.#filmsListContainerComponent);
    remove(this.#filmsListComponent);
    remove(this.#filmsComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilms();
        this.#renderFilms();
        break;
      case UpdateType.MAJOR:
        this.#clearFilms({resetRenderedFilmCardCount: true, resetSortType: true});
        this.#renderFilms();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilms();
        break;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearFilms({resetRenderedFilmCardCount: true});
    this.#renderFilms();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#filmsComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderFilmCard = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListContainerComponent, this.#handleViewAction, this.#handleModeChange);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  }

  #handleModeChange = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.resetView());
  }

  #renderFilmsList = (films) => {
    films.forEach((film) => this.#renderFilmCard(film));
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#filterType);
    render(this.#filmsComponent, this.#noFilmsComponent);
  }

  #renderLoading = () => {
    render(this.#filmsComponent, this.#loadingComponent);
  }

  #handleLoadMoreButtonClick = () => {
    const cardCount = this.films.length;
    const newRenderedFilmCount = Math.min(cardCount, this.#renderedFilmCardCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCardCount, newRenderedFilmCount);

    this.#renderFilmsList(films);
    this.#renderedFilmCardCount = newRenderedFilmCount;

    if (this.#renderedFilmCardCount >= cardCount) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
    this.#loadMoreButtonComponent.setButtonClickHandler(this.#handleLoadMoreButtonClick);

    render(this.#filmsListComponent, this.#loadMoreButtonComponent);
  }

  #clearFilms = ({resetRenderedFilmCardCount = false, resetSortType = false} = {}) => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#loadMoreButtonComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetRenderedFilmCardCount) {
      this.#renderedFilmCardCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderFilms = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsList(films.slice(0, Math.min(filmCount, this.#renderedFilmCardCount)));

    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }


}
