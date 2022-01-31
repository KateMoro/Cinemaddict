import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async (filmId) => {
    try {
      this.#comments = await this.#apiService.getComments(filmId);
    } catch (err) {
      this.#comments = [];
    }
  }
}
