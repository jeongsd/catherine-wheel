import anime from 'animejs';
import _ from 'lodash';
import CatherineWheel from './CatherineWheel';
import './main.css';

var canvasEl = document.querySelector('.fireworks');
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;
// canvasEl.style.width = window.innerWidth + 'px';
// canvasEl.style.height = window.innerHeight + 'px';
// canvasEl.getContext('2d').scale(2, 2);

const catherineWheel = new CatherineWheel({
  canvasEl,
});
// catherineWheel.fire();
// _.range(1).map(() => {
//   catherineWheel.fire();
// })
// catherineWheel.animateFireWork();
// var render = anime({
//   duration: Infinity,
//   update: function() {
//     this.ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
//   }
// });

function autoClick() {
  const parent = catherineWheel.getWheelPosition();
  catherineWheel.fire({ parent, type: 1, isWheelFire: true })
    // .fire({ parent, type: 1 });
  catherineWheel.deg += 5;
  // catherineWheel.animateFireWork();
  anime({ duration: 16 }).finished.then(autoClick);
  // requestAnimationFrame(autoClick);
}
autoClick();
// 1000 /6
