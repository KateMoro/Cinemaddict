import dayjs from 'dayjs';

const getRandomNumber = (a, b, precision) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Number((Math.random() * (max - min) + min).toFixed(precision));
};

const getRandomArrayElement = (elements) => elements[getRandomNumber(0, elements.length - 1)];

const getRandomArray = (arr) => {
  const rand = getRandomNumber(1, arr.length);
  const newArr = [];
  while (newArr.length !== rand) {
    const elem = arr[getRandomNumber(0, arr.length-1)];
    if (newArr.indexOf(elem) === -1) {
      newArr.push(elem);
    }
  }

  return newArr;
};

const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getFormattedDate = (date, format) => dayjs(date).format(format);

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomNumber, getRandomArrayElement, getRandomArray, getTimeFromMins, getFormattedDate, updateItem};
