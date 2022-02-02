import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #filmId = null;
  #comments = [];

  constructor(apiService, filmId) {
    super();
    this.#apiService = apiService;
    this.#filmId = filmId;
  }

  get comments() {
    return this.#comments;
  }

  init = async () => {
    try {
      const comments = await this.#apiService.getComments(this.#filmId);
      this.#comments = comments.map(this.#adaptToClient);
    } catch (err) {
      this.#comments = [];
    }
  }

  addComment = async (updateType, update) => {
    try {
      const response = await this.#apiService.addComment(update, this.#filmId);
      const newComment = this.#adaptToClient(response);
      this.#comments = [newComment, ...this.#comments];

      this._notify(updateType, newComment);
    } catch(err) {
      throw new Error('Can\'t add new comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t delete non-existing comment');
    }

    try {
      await this.#apiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptToClient = (filmComments) => ({
    author: filmComments.author,
    comment: filmComments.comment,
    date: new Date(filmComments.date),
    emotion: filmComments.emotion,
    id: filmComments.id,
  })
}
