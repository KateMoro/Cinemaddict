import dayjs from 'dayjs';
import { getRandomNumber, getRandomArrayElement } from '../utils/common.js';

const authors = [
  'Kuzma Sharp',
  'Andzelika Franke',
  'Klara Darcy',
  'Red Alfaro',
  'Ernest Snell',
];

const comments = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
];

const emotions = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const generateCommentDate = () => {
  const maxDaysGap = 90;
  const daysGap = getRandomNumber(-maxDaysGap, 0);

  return dayjs().add(daysGap, 'day');
};

const generateComment = () => ({
  author: getRandomArrayElement(authors),
  comment: getRandomArrayElement(comments),
  date: generateCommentDate(),
  emotion: getRandomArrayElement(emotions),
});

export { generateComment };
