import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { getRandomNumber, getRandomArrayElement, getRandomArray, getTimeFromMins } from './../utils.js';
import { generateComment } from './comment.js';

const TotalRating = {
  MIN: 0,
  MAX: 10,
};

const AgeRating = {
  MIN: 0,
  MAX: 21,
};

const Duration = {
  MIN: 20,
  MAX: 200,
};

const CommentsNumber = {
  MIN: 0,
  MAX: 5,
};

const titles = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
];

const directors = [
  'Steven Spielberg',
  'Martin Scorsese',
  'Quentin Tarantino',
  'Woody Allen',
];

const writers = [
  'Billy Wilder',
  'Joel Coen',
  'Francis Ford Coppola',
  'William Goldman',
  'Nora Ephron',
  'Ernest Lehman',
  'George Lucas',
];

const actors = [
  'Sean Connery',
  'Liam Neeson',
  'Linda Hamilton',
  'Kurt Russell',
  'Sylvester Stallone',
  'Clint Eastwood',
];

const countries = [
  'Russia',
  'USA',
  'Poland',
  'Italy',
  'Finland',
  'India',
];

const genres = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery',
];

const posters = [
  './images/posters/the-dance-of-life.jpg',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Nunc fermentum tortor. In rutrum ac purus sit amet tempus.',
];

const generateReleaseDate = () => {
  const randYear = getRandomNumber(1920, 1999);
  const randMonth = getRandomNumber(0, 11);
  const randDay = getRandomNumber(1, 31);

  return dayjs().year(randYear).month(randMonth).date(randDay);
};

const generateFilmCard = () => ({
  id: nanoid(),
  title: getRandomArrayElement(titles),
  alternativeTitle: getRandomArrayElement(titles),
  totalRating: getRandomNumber(TotalRating.MIN, TotalRating.MAX, 1),
  poster: getRandomArrayElement(posters),
  ageRating: getRandomNumber(AgeRating.MIN, AgeRating.MAX),
  director: getRandomArrayElement(directors),
  writers: getRandomArray(writers).join(', '),
  actors: getRandomArray(actors).join(', '),
  releaseDate: generateReleaseDate(),
  releaseCountry: getRandomArrayElement(countries),
  runtime: getTimeFromMins(getRandomNumber(Duration.MIN, Duration.MAX)),
  genres: getRandomArray(genres),
  description: getRandomArray(descriptions).join(' '),
  isFavorite: Boolean(getRandomNumber(0, 1)),
  isWatched: Boolean(getRandomNumber(0, 1)),
  isWatchList: Boolean(getRandomNumber(0, 1)),
  comments: Array.from({length: getRandomNumber(CommentsNumber.MIN, CommentsNumber.MAX)}, generateComment),
});

export { generateFilmCard };
