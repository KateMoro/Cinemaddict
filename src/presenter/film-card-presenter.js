import { render, replace, remove } from '../utils/render.js';
import { UserAction, UpdateType, Mode } from '../utils/const.js';

import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
export default class FilmCardPresenter {
  #filmsListContainer = null;
  #changeData = null;
  #changeMode = null;
  #commentsModel = null;
  #film = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;

  #mode = Mode.DEFAULT;

  constructor(filmsListContainer, changeData, changeMode, commentsModel) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
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

    if (this.#filmPopupComponent !== null) {
      this.#renderFilmPopup();
    }
  }

  resetView = () => {
    if (this.#mode === Mode.POPUP) {
      this.#closeFilmPopup();
    }
  }

  #renderFilmPopup = async () => {
    const comments = this.#commentsModel.init(this.#film.id);
    // eslint-disable-next-line no-console
    console.log('renderFilmPopup', comments);

    this.#mode = Mode.POPUP;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmPopupComponent = new FilmPopupView(this.#film);

    this.#filmPopupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#filmPopupComponent.setCommentSubmitHandler(this.#handleCommentSubmit);
    this.#filmPopupComponent.setDeleteButtonClickHandler(this.#handleDeleteButtonClick);

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
    this.#changeMode();

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
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isWatchList: !this.#film.isWatchList}
    );
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isWatched: !this.#film.isWatched}
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isFavorite: !this.#film.isFavorite}
    );
  }

  #handleCommentSubmit = (newComment) => {
    this.#film.comments.push(newComment);

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {...this.#film}
    );
  }

  #handleDeleteButtonClick = (deletedComment) => {
    this.#film.comments = this.#film.comments.filter((comment) => comment.id !== deletedComment.id);

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {...this.#film}
    );
  }

  #closeFilmPopup = () => {
    if (this.#filmPopupComponent !== null) {
      remove(this.#filmPopupComponent);
      this.#filmPopupComponent = null;
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#mode = Mode.DEFAULT;
    }
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  }
}
