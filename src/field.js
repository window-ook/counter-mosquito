'use strict';

import * as sound from './sound.js';

const MOSQUITO_SIZE = 55;

export const ItemType = Object.freeze({
  mosquito: 'mosquito',
});

export class Field {
  constructor(mosquitoCount) {
    this.mosquitoCount = mosquitoCount;
    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener('click', (event) => this.onClick(event));
  }

  init() {
    this.field.innerHTML = ``;
    this._addItem(
      'mosquito',
      this.mosquitoCount,
      'img/mosquito_left.png',
      'img/mosquito_right.png'
    );
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  _addItem(className, count, imgPath1, imgPath2) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - MOSQUITO_SIZE;
    const y2 = this.fieldRect.height - MOSQUITO_SIZE;
    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);

      const randomIndex = Math.floor(Math.random() * 2);
      const selectedImgPath = randomIndex === 0 ? imgPath1 : imgPath2;

      item.setAttribute('src', selectedImgPath);
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }

  onClick(event) {
    const target = event.target;
    if (target.matches('.mosquito')) {
      target.remove();
      sound.playZapper();
      this.onItemClick && this.onItemClick(ItemType.mosquito);
    } else if (target.matches('.game__field')) {
      this.onItemClick && this.onItemClick(ItemType.game__field);
    }
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// this 바인딩
// 어떤 클래스 안에서 다른 콜백으로 전달할 때는 함수에 포함되어있는 클래스의 정보가 사라진다.
// 그래서 함수와 클래스를 묶는 바인딩을 해야 한다.

// 1. 명시적으로 바인드
// this.onClick = this.onClick.bind(this);

// 2. arrow function으로 바인드
// (event) => this.onClick(event);

// 3. 클래스의 멤버 변수로 만들기(함수 표현식)
// onClick = (event) => {}
