'use strict';

import { GameBuilder, Reason } from './game.js';
import PopUp from './popup.js';
import * as sound from './sound.js';

const game = new GameBuilder().gameDuration(5).mosquitoCount(5).build();

game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = '🦟Temoquists Win🦟';
      sound.playLeave();
      break;
    case Reason.win:
      message = '⚡Counter-Temoquist Win⚡';
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
});

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
  game.start();
});
