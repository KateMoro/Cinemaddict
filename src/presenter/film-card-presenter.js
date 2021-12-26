import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, replace, remove } from '../render.js';

export default class FilmCardPresenter {
  #filmsListContainer = null;
  #changeData = null;

  #film = null;

  #filmCardComponent = null;
  #filmPopupComponent = null;

  constructor(filmsListContainer, changeData) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setLinkClickHandler(this.#handleLinkClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this.#filmsListContainer, this.#filmCardComponent);
      return;
    }

    if (this.#filmsListContainer.element.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  #renderFilmPopup = () => {
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmPopupComponent = new FilmPopupView(this.#film);

    this.#filmPopupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    document.addEventListener('keydown', this.#escKeyDownHandler);

    if (prevFilmPopupComponent === null) {
      render(this.#filmsListContainer, this.#filmPopupComponent);
      return;
    }

    if (this.#filmsListContainer.element.contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmPopupComponent);
  }

  #handleLinkClick = () => {
    this.#renderFilmPopup();
    document.body.classList.add('hide-overflow');
  }

  #handleCloseButtonClick = () => {
    this.#closeFilmPopup();
    document.body.classList.remove('hide-overflow');
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleCloseButtonClick();
    }
  }

  #handleWatchlistClick = () => {
    this.#changeData( {...this.#film, isWatchList: !this.#film.isWatchList} );
  }

  #handleWatchedClick = () => {
    this.#changeData( {...this.#film, isWatched: !this.#film.isWatched} );
  }

  #handleFavoriteClick = () => {
    this.#changeData( {...this.#film, isFavorite: !this.#film.isFavorite} );
  }

  #closeFilmPopup = () => {
    if (this.#filmPopupComponent !== null) {
      remove(this.#filmPopupComponent);
      this.#filmPopupComponent = null;
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  }
}
