
import { render } from './utils/render.js';

import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';

import FilmsListPresenter from './presenter/films-list-presenter.js';




const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');
const pageFooter = document.querySelector('.footer');
const pageFooterStatistics = pageFooter.querySelector('.footer__statistics');

render(pageHeader, new ProfileView());
render(pageMain, new MainNavigationView());
render(pageFooterStatistics, new FooterStatisticsView());

const filmsPresenter = new FilmsListPresenter(pageMain);
filmsPresenter.init(cards);
