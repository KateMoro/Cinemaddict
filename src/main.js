import { renderTemplate, RenderPosition } from './render.js';
import { createProfileTemplate } from './view/profile-view.js';
import { createMainNavigationTemplate } from './view/main-navigation-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createFilmsTemplate } from './view/films-view.js';
import { createFilmCardTemplate } from './view/film-card-view.js';
import { createLoadMoreButtonTemplate } from './view/load-more-button-view.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics-view.js';
import { createFilmDetailsPopupTemplate } from './view/film-details-popup-view.js';

const CARD_COUNT = 5;
const EXTRA_CARD_COUNT = 2;

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');
const pageFooter = document.querySelector('.footer');
const pageFooterStatistics = pageFooter.querySelector('.footer__statistics');

renderTemplate(pageHeader, createProfileTemplate());
renderTemplate(pageMain, createMainNavigationTemplate());
renderTemplate(pageMain, createSortTemplate());
renderTemplate(pageMain, createFilmsTemplate());
renderTemplate(pageFooterStatistics, createFooterStatisticsTemplate());
renderTemplate(pageFooter, createFilmDetailsPopupTemplate(), RenderPosition.AFTEREND);

const filmList = pageMain.querySelector('.films-list__container');
const filmListExtra = pageMain.querySelectorAll('.films-list--extra .films-list__container');

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(filmList, createFilmCardTemplate());
}

renderTemplate(filmList, createLoadMoreButtonTemplate());

filmListExtra.forEach( (list) => {
  for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
    renderTemplate(list, createFilmCardTemplate());
  }
});
