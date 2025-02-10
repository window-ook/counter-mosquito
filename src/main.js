'use strict';

import { GameBuilder, Reason } from './game.js';
import PopUp from './popup.js';
import * as sound from './sound.js';

// Get user input for game settings
const gameDuration = parseInt(prompt('제한 시간을 설정하세요', '10')) || 10;
const mosquitoCount = parseInt(prompt('모기의 수를 설정하세요', '5')) || 5;

const game = new GameBuilder()
  .gameDuration(gameDuration)
  .mosquitoCount(mosquitoCount)
  .build();

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
