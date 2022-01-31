import { render } from './utils/render.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import FilterModel from './model/filter-model.js';
import FilmsModel from './model/films-model.js';
import ApiService from './api-service.js';

const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic dFh546RfHdg4';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');
const pageFooter = document.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel(apiService);

const filterPresenter = new FilterPresenter(pageHeader, pageMain, filmsModel, filterModel);
const filmsPresenter = new FilmsListPresenter(pageMain, filmsModel, filterModel);

filterPresenter.init();
filmsPresenter.init();

filmsModel.init().finally(() => {
  render(pageFooter, new FooterStatisticsView(filmsModel.films));
});


const filmsPresenter = new FilmsListPresenter(pageMain);
filmsPresenter.init(cards);
