'use strict';

(function () {
  // var NUMBER_DATA = 8;
  var URL = 'https://js.dump.academy/keksobooking/data';
  var MAIN_PIN = {
    WIDTH: 65,
    HEIGHT: 65,
    POINTER_Y: 22
  };

  var openCardStatus = true;
  var addressData;

  var locationX = Math.round(getRandomRange(0, 1200) + MAIN_PIN.WIDTH / 2);
  var locationY = Math.round(getRandomRange(130, 630) + MAIN_PIN.HEIGHT / 2);

  var map = document.querySelector('.map');
  var buttonPin = map.querySelector('.map__pin');

  var form = document.querySelector('.ad-form');
  var formInput = form.querySelectorAll('input');
  var formSelect = form.querySelectorAll('select');
  var formTextarea = form.querySelector('textarea');
  var formButton = form.querySelectorAll('.ad-form__submit');


  // Выдает рандомное число в диапозоне от minNumber до maxNumber
  var getRandomRange = function (minNumber, maxNumber) {
    return Math.round(Math.random() * (maxNumber - minNumber) + minNumber);
  };

  // Выводит в созданный div информацию об ошибке
  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var renderCards = function (i) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.card.createCard(addressData[i]));
    map.insertBefore(fragment, map.querySelector('.map__filters-container'));
  };

  // Сохраняет базу данных адресов из базы даннных после успешного получения с сервера
  var onLoad = function (onloadData) {
    addressData = onloadData;
  };

  // Получает данные с сервера
  window.backend.load(URL, onLoad, onError);

  // Обработчик закрытия окна карточки ESC
  var onPopupEscPress = function (evt) {
    window.utils.isEscEvent(evt, closePopup);
  };

  // Закрывает popup: удаляет показанное объявление из разметки, удаляет обработчик ESC
  var closePopup = function () {
    document.querySelector('.popup').remove();
    document.removeEventListener('keydown', onPopupEscPress);
    openCardStatus = true;
  };

  // Выводит карточку на экран
  var showCard = function (evt) {
    if (evt.target.closest('button') && evt.target.closest('button').tagName.toLowerCase() === 'button') {
      var dataIndex = evt.target.closest('button').dataset.index;
      if (openCardStatus && dataIndex) {
        renderCards(dataIndex);
        openCardStatus = false;
        // Включаю слушатель на закрытие по ESC
        document.addEventListener('keydown', onPopupEscPress);

        var setupCloseCard = document.querySelector('.popup__close');
        // включаю слушатель закрытия карточки объявления по клику
        setupCloseCard.addEventListener('click', function () {
          closePopup();
        });
        // Закрывает карточку объявления по табу
        // setupCloseCard.addEventListener('keydown', function () {
        //   window.utils.isEnterEvent(evt, closePopup);
        // });
      }
    }
  };

  // Активирует карточку объявления при клике на метку на блок map__pins через делегирование
  var setupOpenCard = map.querySelector('.map__pins');
  setupOpenCard.addEventListener('click', showCard);

  // Активирует карточку объявления пo tab
  setupOpenCard.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, showCard);
  });

  // Активизирует карту, показывает обновленный адрес со сдвигом на метку
  var openMap = function () {
    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');

    // Отрисовывает метки из базы данных
    window.pin.renderPins(addressData);

    activateInputForm();
    locationY += Math.round(MAIN_PIN.HEIGHT / 2 + MAIN_PIN.POINTER_Y);
    showAddress();

    buttonPin.removeEventListener('keydown', onOpenMapEnterPress);
  };

  // Добавляет в 'ad-form' всем  input и select disabled
  var disableInputForm = function () {
    disablePartForm(formInput);
    disablePartForm(formSelect);
    disablePartForm(formTextarea);
    disablePartForm(formButton);
  };

  var disablePartForm = function (partForm) {
    for (var i = 0; i < partForm.length; i++) {
      partForm[i].disabled = true;
    }
  };

  // Удаляет из 'ad-form' input и select disabled
  var activateInputForm = function () {
    activatePartForm(formInput);
    activatePartForm(formSelect);
    activatePartForm(formTextarea);
    activatePartForm(formButton);
  };

  var activatePartForm = function (partForm) {
    for (var i = 0; i < partForm.length; i++) {
      partForm[i].disabled = false;
    }
  };

  // Показывает адрес текущей метки
  var showAddress = function () {
    form.querySelector('#address').value = locationX + ', ' + locationY;
  };

  showAddress();
  disableInputForm();

  // Обработчик открытия окна
  var onOpenMapEnterPress = function (evt) {
    window.utils.isEnterEvent(evt, openMap);

  };

  // Активирует метку при нажатие основной кнопки мыши
  buttonPin.addEventListener('mousedown', function (evt) {
    window.utils.isMouseMainClickEvent(evt, openMap);
  });

  // Активирует метку при нажатие Enter
  buttonPin.addEventListener('keydown', onOpenMapEnterPress);


})();