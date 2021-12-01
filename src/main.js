import { render, RenderPosition } from './render.js';
import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import SortView from './view/sort-view.js';
import FilmsView from './view/films-view.js';
import FilmCardView from './view/film-card-view.js';
import LoadMoreButtonView from './view/load-more-button-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import FilmDetailsPopupView from './view/film-details-popup-view.js';
import { generateFilmCard } from './mock/film-card.js';

const CARD_COUNT = 18;
const CARD_COUNT_PER_STEP = 5;
const EXTRA_CARD_COUNT = 2;

const cards = Array.from({length: CARD_COUNT}, generateFilmCard);

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');
const pageFooter = document.querySelector('.footer');
const pageFooterStatistics = pageFooter.querySelector('.footer__statistics');

render(pageHeader, new ProfileView().element);
render(pageMain, new MainNavigationView().element);
render(pageMain, new SortView().element);
render(pageMain, new FilmsView().element);
render(pageFooterStatistics, new FooterStatisticsView().element);
render(pageFooter, new FilmDetailsPopupView(cards[0]).element, RenderPosition.AFTEREND);

const filmList = pageMain.querySelector('.films-list:first-child');
const filmListContainer = filmList.querySelector('.films-list__container');
const filmListTopRated = pageMain.querySelector('.films-list:nth-child(2) .films-list__container');
const filmListMostCommented = pageMain.querySelector('.films-list:nth-child(3) .films-list__container');

for (let i = 0; i < Math.min(cards.length, CARD_COUNT_PER_STEP); i++) {
  render(filmListContainer, new FilmCardView(cards[i]).element);
}

if (cards.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  render(filmList, new LoadMoreButtonView().element);

  const loadMoreButton = filmList.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    cards
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((card) => render(filmListContainer, new FilmCardView(card).element));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= cards.length) {
      loadMoreButton.element.remove();
      loadMoreButton.removeElement();
    }
  });
}

const cardsSortedByRating = cards.slice().sort((a, b) => b.totalRating - a.totalRating);
const cardsSortedByCommentsNumber = cards.slice().sort((a, b) => b.comments.length - a.comments.length);

for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
  render(filmListTopRated, new FilmCardView(cardsSortedByRating[i]).element);
}

for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
  render(filmListMostCommented, new FilmCardView(cardsSortedByCommentsNumber[i]).element);
}
