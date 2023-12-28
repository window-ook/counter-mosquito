'use strict';

import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  mosquitoCount(num) {
    this.mosquitoCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration, //
      this.mosquitoCount //
    );
  }
}

class Game {
  constructor(gameDuration, mosquitoCount) {
    this.gameDuration = gameDuration;
    this.mosquitoCount = mosquitoCount;

    this.gameButton = document.querySelector('.game__button');
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScoreBox = document.querySelector('.game__score');
    this.gameScore = document.querySelector('.game__score--text');
    this.gameButton.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.gameField = new Field(mosquitoCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }

  stop(reason) {
    this.started = false;
    this.hideGameButton();
    this.stopGameTimer();
    sound.stopBackground();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.mosquito) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.mosquitoCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.gameField) {
      this.stop(Reason.lose);
    }
  };

  initGame() {
    this.score = 0;
    this.updateScoreBoard();
    this.gameField.init();
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.mosquitoCount - this.score;
  }

  showStopButton() {
    const btnText = this.gameButton.querySelector('.game__button_text');
    btnText.innerText = 'STOP';
    this.gameButton.style.visibility = 'visible';
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScoreBox.style.visibility = 'visible';
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);

    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(
          this.mosquitoCount === this.score ? Reason.win : Reason.cancel
        );
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  hideGameButton() {
    this.gameButton.style.visibility = 'hidden';
  }
}
