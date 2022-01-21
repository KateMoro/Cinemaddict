import SmartView from './smart-view.js';
import { getFormattedDate } from '../utils/common.js';

const createFilmPopupTemplate = ({
  title,
  alternativeTitle,
  totalRating,
  poster,
  ageRating,
  director,
  writers,
  actors,
  releaseDate,
  releaseCountry,
  runtime,
  genres,
  description,
  isWatchList,
  isWatched,
  isFavorite,
  comments,
  newCommentEmotion}) => {

  const activeClassName = (item) => item ? 'film-details__control-button--active' : '';

  const createGenresTemplate = (genreList) => genreList.map((genre) => `<span class="film-details__genre">${genre}</span>`);

  const createCommentTemplate = (commentList) => commentList.map(({author, comment, date, emotion}) => `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${getFormattedDate(date, 'YYYY/MM/DD HH:mm')}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`);

  const createNewCommentTemplate = (emotion) => (`
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        ${emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ''}
      </div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>
      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>
  `);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">
            <p class="film-details__age">${ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getFormattedDate(releaseDate, 'D MMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${runtime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${createGenresTemplate(genres).join('')}</td>
              </tr>
            </table>
            <p class="film-details__film-description">${description}</p>
          </div>
        </div>
        <section class="film-details__controls">
          <button type="button"
                  class="film-details__control-button
                        film-details__control-button--watchlist
                        ${activeClassName(isWatchList)}"
                  id="watchlist" name="watchlist">
                  Add to watchlist
          </button>
          <button type="button"
                  class="film-details__control-button
                        film-details__control-button--watched
                        ${activeClassName(isWatched)}"
                  id="watched" name="watched">
                  Already watched
          </button>
          <button type="button"
                  class="film-details__control-button
                        film-details__control-button--favorite
                        ${activeClassName(isFavorite)}"
                  id="favorite" name="favorite">
                  Add to favorites
          </button>
        </section>
      </div>
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list">
            ${createCommentTemplate(comments).join('')}
          </ul>
          ${createNewCommentTemplate(newCommentEmotion)}
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmPopupView extends SmartView {

  constructor(film) {
    super();
    this._data = FilmPopupView.parseFilmToData(film);
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupTemplate(this._data);
  }

  static parseFilmToData = (film) => ({
    ...film,
    newCommentEmotion: '',
    newCommentText: '',
  })

  static parseDataToFilm = (data) => {
    const film = {...data};

    delete film.newCommentEmotion;
    delete film.newCommentText;

    return film;
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiChangeHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    const scrollPosition = this.element.scrollTop;
    this.updateData({newCommentEmotion: target.value});
    this.element.scrollTo(0, scrollPosition);
    if (this._data.newCommentText) {
      this.element.querySelector('.film-details__comment-input').value = this._data.newCommentText;
    }
    this.element.querySelector(`[value=${target.value}]`).checked = true;
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({newCommentText: evt.target.value}, true);
  }

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }
}
