import { getUserRank } from '../utils/common.js';
import AbstractView from './abstract-view.js';

const createProfileTemplate = (watchedFilms) => (`
  <section class="header__profile profile">
    <p class="profile__rating">${getUserRank(watchedFilms)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
`);

export default class ProfileView extends AbstractView {
  #watchedFilms = null;

  constructor(watchedFilms) {
    super();
    this.#watchedFilms = watchedFilms;
  }

  get template() {
    return createProfileTemplate(this.#watchedFilms);
  }
}
