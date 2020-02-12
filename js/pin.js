'use strict';
// Создает метку на основе шаблона #pin по полученному объекту
(function () {
  var PIN = {
    WIDTH: 40,
    HEIGHT: 40
  };

  var similarPinTemplate = document.querySelector('#pin').content;
  var similarPinElement = document.querySelector('.map').querySelector('.map__pins');

  // Создает pin с адресом, аватором на img и alt для img
  var createPin = function (address, i) {
    var addressElement = similarPinTemplate.cloneNode(true);
    var locationUnion = 'left: ' + (address.location.x - PIN.WIDTH / 2) + 'px; ' + 'top: ' + (address.location.y - PIN.HEIGHT) + 'px; ';

    addressElement.querySelector('.map__pin').style = locationUnion;
    addressElement.querySelector('img').src = address.author.avatar;
    addressElement.querySelector('img').alt = address.offer.title;
    addressElement.querySelector('.map__pin').dataset.index = i;
    // добавляет класс hiden меткам
    // addressElement.classList.add('hiden');
    return addressElement;
  };

  // Выводит в разметку созданные метки
  window.pin = {
    renderPins: function (addressData) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < addressData.length; i++) {
        fragment.appendChild(createPin(addressData[i], i));
      }
      similarPinElement.appendChild(fragment);
    }
  };
})();
