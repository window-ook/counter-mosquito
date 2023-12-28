'use strict';

import { GameBuilder, Reason } from './game.js';
import PopUp from './popup.js';
import * as sound from './sound.js';

const game = new GameBuilder().gameDuration(2).mosquitoCount(5).build();

game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = '🦟Temmoquists Win🦟';
      sound.playLeave();
      break;
    case Reason.win:
      message = '⚡Counter-Temmoquist Win⚡';
      sound.playWin();
      break;
    case Reason.lose:
      message = 'You hurted your friend!';
      sound.playMiss();
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
  // 게임 종료 후 Field의 클릭을 무시하도록 설정
  game.gameField.isClickable = false;
});

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
  game.start();
  game.gameField.isClickable = true;
});
