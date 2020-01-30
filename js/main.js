'use strict';

var NUMBER_DATA = 8;
var PIN_SIZE_X = 40;
var PIN_SIZE_Y = 40;

var type = ['palace', 'flat', 'house', 'bungalo'];
var typeRu = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var checkin = ['12:00', '13:00', '14:00'];
var checkout = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var similarPinTemplate = document.querySelector('#pin').content;
var similarPinElement = document.querySelector('.map').querySelector('.map__pins');

var similarCardTemplate = document.querySelector('#card').content;

var similarCardElement = document.querySelector('.map');


// Выдает рандомное число в диапозоне от 0 до maxNumber
var receiveRandom = function (maxNumber) {
  return Math.round(Math.random() * maxNumber);
};

// Выдает рандомное число в диапозоне от minNumber до maxNumber
var receiveRandomRange = function (minNumber, maxNumber) {
  return Math.round(Math.random() * (maxNumber - minNumber) + minNumber);
};

// Выдает на основе входящего массива один рандомный элемент массива
var getRandomElement = function (arr) {
  var numberRandom = receiveRandom(arr.length - 1);
  return arr[numberRandom];
};

// Выдает на основе входящего массива массив с рандомным кол-вом элементов
var getRandomArray = function (arr) {
  var numberRandom = receiveRandom(arr.length);
  var arrClon = arr.slice();
  var arrNew = [];
  var numberArrRandom;

  for (var j = 0; j < numberRandom; j++) {
    numberArrRandom = receiveRandom(arrClon.length - 1);
    arrNew[j] = arrClon[numberArrRandom];
    arrClon.splice(numberArrRandom, 1);
  }
  return arrNew;
};

// Создает массив с рандомными объектами адрессов по входящему кол-ву массива
var createAddressData = function (number) {
  var anyAddressData = [];
  for (var i = 0; i < number; i++) {
    anyAddressData[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Заголовок предложения',
        address: '600, 350',
        price: receiveRandomRange(1000, 9999),
        type: getRandomElement(type),
        rooms: receiveRandom(10),
        guests: receiveRandom(10),
        checkin: getRandomElement(checkin),
        checkout: getRandomElement(checkout),
        features: getRandomArray(features),
        description: 'строка с описанием',
        photos: getRandomArray(photos)
      },
      location: {
        x: receiveRandom(1200),
        y: receiveRandomRange(130, 650)
      }
    };
  }
  return anyAddressData;
};

// Создает метку на основе шаблона #pin по полученному объекту
var renderPin = function (address) {
  var addressElement = similarPinTemplate.cloneNode(true);
  var locationUnion = 'left: ' + (address.location.x - PIN_SIZE_X / 2) + 'px; ' + 'top: ' + (address.location.y - PIN_SIZE_Y) + 'px; ';

  addressElement.querySelector('.map__pin').style = locationUnion;
  addressElement.querySelector('img').src = address.author.avatar;
  addressElement.querySelector('img').alt = address.offer.title;
  return addressElement;
};

// Выводит в разметку созданные метки
var renderPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < addressData.length; i++) {
    fragment.appendChild(renderPin(addressData[i]));
  }
  similarPinElement.appendChild(fragment);
};

// Переводит тип адреса с английского на русский
var translateType = function (x) {
  for (var i = 0; i < type.length; i++) {
    if (type[i] === x) {
      return typeRu[i];
    }
  }
  return x;
};

// Удаляет список дочерние элементы list и cоздает на основе входящего массива arr новый список
var renderFeature = function (arr, list) {
  list.innerHTML = '';
  for (var i = 0; i < arr.length; i++) {
    var newElementLi = document.createElement('li');
    newElementLi.classList.add('popup__feature');
    newElementLi.classList.add('popup__feature--' + arr[i]);
    list.appendChild(newElementLi);
  }
};

// Создает список фотографий из полученного массива
var renderPhotos = function (arr, photosTemplate) {
  photosTemplate.querySelector('img').src = arr[0];
  for (var i = 1; i < arr.length; i++) {
    var newElementImg = photosTemplate.querySelector('img').cloneNode(true);
    newElementImg.src = arr[i];
    photosTemplate.appendChild(newElementImg);
  }
};

// Создает карточку адреса по шаблону #card по полученному объекту
var renderCard = function (addressObject) {
  var addressElement = similarCardTemplate.cloneNode(true);
  var list = addressElement.querySelector('.popup__features');
  var photosTemplate = addressElement.querySelector('.popup__photos');

  addressElement.querySelector('.popup__title').textContent = addressObject.offer.title;
  addressElement.querySelector('.popup__text--address').textContent = addressObject.offer.address;
  addressElement.querySelector('.popup__text--price').textContent = addressObject.offer.price + '₽/ночь';
  addressElement.querySelector('.popup__type').textContent = translateType(addressObject.offer.type);
  addressElement.querySelector('.popup__text--capacity').textContent = addressObject.offer.rooms + ' комнаты для ' + addressObject.offer.guests + ' гостей';
  addressElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + addressObject.offer.checkin + ', выезд до ' + addressObject.offer.checkout;
  addressElement.querySelector('.popup__description').textContent = addressObject.offer.description;
  addressElement.querySelector('.popup__avatar').src = addressObject.author.avatar;

  if (addressObject.offer.features[0]) {
    renderFeature(addressObject.offer.features, list);
  } else {
    addressElement.querySelector('.popup__features').remove();
  }

  if (addressObject.offer.photos[0]) {
    renderPhotos(addressObject.offer.photos, photosTemplate);
  } else {
    addressElement.querySelector('.popup__photos').remove();
  }

  return addressElement;
};

// Выводит в разметку созданные карточки
var renderCards = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 1; i++) {
    fragment.appendChild(renderCard(addressData[i]));
  }
  similarCardElement.insertBefore(fragment, similarCardElement.querySelector('.map__filters-container'));
};

var addressData = createAddressData(NUMBER_DATA);
document.querySelector('.map').classList.remove('map--faded');
renderPins();

renderCards();

// var addressCard = renderCard(addressData[0]);
// console.log(addressData[0]);
// console.log(addressCard);
