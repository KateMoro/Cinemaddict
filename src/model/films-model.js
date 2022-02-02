import { UpdateType } from '../utils/const.js';
import AbstractObservable from '../utils/abstract-observable.js';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update non-existing film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        update,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film card');
    }
  }

  #adaptToClient = (film) => ({
    id: film['id'],
    comments: film['comments'],
    title: film['film_info']['title'],
    alternativeTitle: film['film_info']['alternative_title'],
    totalRating: film['film_info']['total_rating'],
    poster: film['film_info']['poster'],
    ageRating: film['film_info']['age_rating'],
    director: film['film_info']['director'],
    writers: film['film_info']['writers'],
    actors: film['film_info']['actors'],
    releaseDate: new Date(film['film_info']['release']['date']),
    releaseCountry: film['film_info']['release']['release_country'],
    runtime: film['film_info']['runtime'],
    genres: film['film_info']['genre'],
    description: film['film_info']['description'],
    isWatchList: film['user_details']['watchlist'],
    isWatched: film['user_details']['already_watched'],
    isFavorite: film['user_details']['favorite'],
    watchingDate: film['user_details']['watching_date'] !== null ? new Date(film['user_details']['watching_date']) : film['user_details']['watching_date'],
  })

}
