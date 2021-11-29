import { renderTemplate, RenderPosition } from './render.js';
import { createProfileTemplate } from './view/profile-view.js';
import { createMainNavigationTemplate } from './view/main-navigation-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createFilmsTemplate } from './view/films-view.js';
import { createFilmCardTemplate } from './view/film-card-view.js';
import { createLoadMoreButtonTemplate } from './view/load-more-button-view.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics-view.js';
import { createFilmDetailsPopupTemplate } from './view/film-details-popup-view.js';
import { generateFilmCard } from './mock/film-card.js';

const CARD_COUNT = 18;
const CARD_COUNT_PER_STEP = 5;
const EXTRA_CARD_COUNT = 2;

const cards = Array.from({length: CARD_COUNT}, generateFilmCard);

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');
const pageFooter = document.querySelector('.footer');
const pageFooterStatistics = pageFooter.querySelector('.footer__statistics');

renderTemplate(pageHeader, createProfileTemplate());
renderTemplate(pageMain, createMainNavigationTemplate());
renderTemplate(pageMain, createSortTemplate());
renderTemplate(pageMain, createFilmsTemplate());
renderTemplate(pageFooterStatistics, createFooterStatisticsTemplate());
renderTemplate(pageFooter, createFilmDetailsPopupTemplate(cards[0]), RenderPosition.AFTEREND);

const filmList = pageMain.querySelector('.films-list:first-child');
const filmListContainer = filmList.querySelector('.films-list__container');
const filmListTopRated = pageMain.querySelector('.films-list:nth-child(2) .films-list__container');
const filmListMostCommented = pageMain.querySelector('.films-list:nth-child(3) .films-list__container');

for (let i = 0; i < Math.min(cards.length, CARD_COUNT_PER_STEP); i++) {
  renderTemplate(filmListContainer, createFilmCardTemplate(cards[i]));
}

if (cards.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  renderTemplate(filmList, createLoadMoreButtonTemplate());

  const loadMoreButton = filmList.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    cards
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((card) => renderTemplate(filmListContainer, createFilmCardTemplate(card)));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= cards.length) {
      loadMoreButton.remove();
    }
  });
}

const cardsSortedByRating = cards.slice().sort((a, b) => b.totalRating - a.totalRating);
const cardsSortedByCommentsNumber = cards.slice().sort((a, b) => b.comments.length - a.comments.length);

for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
  renderTemplate(filmListTopRated, createFilmCardTemplate(cardsSortedByRating[i]));
}

for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
  renderTemplate(filmListMostCommented, createFilmCardTemplate(cardsSortedByCommentsNumber[i]));
}
