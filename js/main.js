'use strict';

var NUMBER_DATA = 8;
var PIN_SIZE_X = 40;
var PIN_SIZE_Y = 40;

var type = ['palace', 'flat', 'house', 'bungalo'];
var checkin = ['12:00', '13:00', '14:00'];
var checkout = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var similarPinTemplate = document.querySelector('#pin').content;
var similarPinElement = document.querySelector('.map').querySelector('.map__pins');

var receiveRandom = function (maxNumber) {
  return Math.round(Math.random() * maxNumber);
};

var receiveRandomRange = function (minNumber, maxNumber) {
  return Math.round(Math.random() * (maxNumber - minNumber) + minNumber);
};

var getRandomElement = function (arr) {
  var numberRandom = receiveRandom(arr.length - 1);
  return arr[numberRandom];
};

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
        price: receiveRandom(100),
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

var renderPin = function (address) {
  var addressElement = similarPinTemplate.cloneNode(true);
  var locationUnion = 'left: ' + (address.location.x - PIN_SIZE_X / 2) + 'px; ' + 'top: ' + (address.location.y - PIN_SIZE_Y) + 'px; ';

  addressElement.querySelector('.map__pin').style = locationUnion;
  addressElement.querySelector('img').src = address.author.avatar;
  addressElement.querySelector('img').alt = address.offer.title;
  return addressElement;
};

var renderPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < addressData.length; i++) {
    fragment.appendChild(renderPin(addressData[i]));
  }
  similarPinElement.appendChild(fragment);
};

var addressData = createAddressData(NUMBER_DATA);
document.querySelector('.map').classList.remove('map--faded');
renderPins();
