import AbstractView from './abstract-view.js';
import { getFormattedDate } from '../utils.js';

const createFilmCardTemplate = ({title, totalRating, releaseDate, runtime, genres, poster, description, comments, isWatchList, isWatched, isFavorite}) => {

  const activeClassName = (item) => item ? 'film-card__controls-item--active' : '';

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getFormattedDate(releaseDate, 'YYYY')}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item
                     film-card__controls-item--add-to-watchlist
                     ${activeClassName(isWatchList)}"
                     type="button">
                     Add to watchlist
      </button>
      <button class="film-card__controls-item
                     film-card__controls-item--mark-as-watched
                     ${activeClassName(isWatched)}"
                     type="button">
                     Mark as watched
      </button>
      <button class="film-card__controls-item
                     film-card__controls-item--favorite
                     ${activeClassName(isFavorite)}"
                     type="button">
                     Mark as favorite
      </button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  #card = null;

  constructor(card) {
    super();
    this.#card = card;
  }

  get template() {
    return createFilmCardTemplate(this.#card);
  }
}
