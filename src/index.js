import anime from 'animejs';
import catherinWheel from './catherineWheel';
import './main.css';
const { animateParticules, render, setCanvasSize } = catherinWheel();

var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;

animateParticules(
  anime.random(centerX-50, centerX+50),
  anime.random(centerY-50, centerY+50)
);

window.addEventListener('load', function() {
  render.play();

  setCanvasSize();
}, false);
