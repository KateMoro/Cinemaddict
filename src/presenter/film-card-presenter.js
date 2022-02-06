import { render, replace, remove } from '../utils/render.js';
import { END_POINT, AUTHORIZATION, UserAction, UpdateType, Mode, State } from '../utils/const.js';

import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';

import ApiService from '../api-service.js';
import CommentsModel from '../model/comments-model.js';

export default class FilmCardPresenter {
  #filmsListContainer = null;
  #changeData = null;
  #changeMode = null;
  #setActivePopupId = null;
  #setScrollPosition = null;

  #film = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #apiService = null;
  #commentsModel = null;
  #mode = Mode.DEFAULT;

  constructor(filmsListContainer, changeData, changeMode, setActivePopupId, setScrollPosition) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#setActivePopupId = setActivePopupId;
    this.#setScrollPosition = setScrollPosition;
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
      this.renderFilmPopup();
    }
  }

  resetView = () => {
    if (this.#mode === Mode.POPUP) {
      this.#closeFilmPopup();
    }
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#filmPopupComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#filmPopupComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#filmPopupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#filmPopupComponent.shake(resetFormState);
        break;
    }
  }

  renderFilmPopup = async (scrollPosition) => {
    this.#apiService = new ApiService(END_POINT, AUTHORIZATION);
    this.#commentsModel = new CommentsModel(this.#apiService, this.#film.id);
    await this.#commentsModel.init();
    this.#mode = Mode.POPUP;

    this.#setActivePopupId(this.#film.id);

    const prevFilmPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new FilmPopupView(this.#film, this.#commentsModel.comments, this.setScrollPosition);

    this.#filmPopupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#filmPopupComponent.setCommentSubmitHandler(this.#handleCommentSubmit);
    this.#filmPopupComponent.setDeleteButtonClickHandler(this.#handleDeleteButtonClick);

    document.addEventListener('keydown', this.#escKeyDownHandler);

    if (prevFilmPopupComponent === null) {
      render(document.body, this.#filmPopupComponent);
      this.#filmPopupComponent.element.scrollTop = scrollPosition;
      return;
    }

    if (document.body.contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmPopupComponent);
  }

  #handleLinkClick = () => {
    this.#changeMode();
    this.renderFilmPopup();
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
      { ...this.#film, isWatchList: !this.#film.isWatchList }
    );
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.#film, isWatched: !this.#film.isWatched }
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.#film, isFavorite: !this.#film.isFavorite }
    );
  }

  #handleCommentSubmit = (newComment) => {
    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      newComment
    );
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      { ...this.#film, comments: this.#film.comments }
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
      { ...this.#film, comments: this.#film.comments }
    );
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.setViewState(State.SAVING);
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch(err) {
          this.setViewState(State.ABORTING);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.setViewState(State.DELETING);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch(err) {
          this.setViewState(State.ABORTING);
        }
        break;
    }
  }

  #closeFilmPopup = () => {
    if (this.#filmPopupComponent !== null) {
      remove(this.#filmPopupComponent);
      this.#filmPopupComponent = null;
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#mode = Mode.DEFAULT;
      this.#setActivePopupId(null);
    }
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  }
}
