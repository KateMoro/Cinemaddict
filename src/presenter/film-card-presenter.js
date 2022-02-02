import { render, replace, remove } from '../utils/render.js';
import { END_POINT, AUTHORIZATION, UserAction, UpdateType, Mode } from '../utils/const.js';

import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';

import ApiService from '../api-service.js';
import CommentsModel from '../model/comments-model.js';

export default class FilmCardPresenter {
  #filmsListContainer = null;
  #changeData = null;
  #changeMode = null;
  #film = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #apiService = null;
  #commentsModel = null;
  #mode = Mode.DEFAULT;

  constructor(filmsListContainer, changeData, changeMode) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
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

  // setViewState = (state) => {
  //   switch (state) {
  //     case State.SAVING:
  //       this.#filmPopupComponent.updateData({
  //         isDisabled: true,
  //         isSaving: true,
  //       });
  //       break;
  //     case State.DELETING:
  //       this.#filmPopupComponent.updateData({
  //         isDisabled: true,
  //         isDeleting: true,
  //       });
  //       break;
  //   }
  // }

  #renderFilmPopup = async () => {
    this.#apiService = new ApiService(END_POINT, AUTHORIZATION);
    this.#commentsModel = new CommentsModel(this.#apiService, this.#film.id);
    await this.#commentsModel.init();

    this.#mode = Mode.POPUP;
    const prevFilmPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new FilmPopupView(this.#film, this.#commentsModel.comments);

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
    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      newComment
    );
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, comments: this.#film.comments}
    );
  }

  #handleDeleteButtonClick = (deletedCommentId) => {
    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      deletedCommentId
    );

    const index = this.#film.comments.findIndex((item) => item === deletedCommentId);
    this.#film.comments = [
      ...this.#film.comments.slice(0, index),
      ...this.#film.comments.slice(index + 1),
    ];

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, comments: this.#film.comments}
    );
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        // this.setViewState(State.SAVING);
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        // this.setViewState(State.DELETING);
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
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
