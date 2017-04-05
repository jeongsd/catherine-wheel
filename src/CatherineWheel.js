import anime from 'animejs';
import { Vector } from 'vectorious';
import uuidV1 from 'uuid/v1';
import FireworkRule, { Payload } from './FireworkRule';
import Particle from './Particle';

// https://www.wikiwand.com/en/Cross_product
function crossProduct(u, v) {
  return new Vector([
    u.data[1] * v.data[2] - u.data[2] * v.data[1],
    u.data[2] * v.data[0] - u.data[0] * v.data[2],
    u.data[0] * v.data[1] - u.data[1] * v.data[0],
  ]);
}

const Z_AXIS = new Vector([0, 0, 1]);

const rule = new FireworkRule({
  type: 1,
  minAge: 1.5,
  maxAge: 2.5,
  minVelocity: new Vector([0, 0, 0]),
  maxVelocity: new Vector([1000, 1000, 0]),
  damping: 0.1,
  payloads: [
    new Payload({ type: 3, count: 4 }),
    new Payload({ type: 5, count: 4 }),
  ],
});

const store = {};

const INIT_RADIUS = 200;
const INIT_DEG = 0;

class CatherineWheel {
  constructor(props) {
    const {
      deg = INIT_DEG,
      radius = INIT_RADIUS,
      canvasEl,
    } = props;

    this.radius = radius;
    this.deg = deg;
    this.ctx = canvasEl.getContext('2d');
    this.canvasEl = canvasEl;

    this.renderParticule = this.renderParticule.bind(this);
  }

  fire() {
    const deg = this.deg + anime.random(-5, 5);

    const radian = deg * Math.PI / 180;
    const firePosition = new Vector([this.radius * Math.cos(radian), this.radius * Math.sin(radian), 0]);
    const firework = rule.create({
      parent: new Particle({ position: firePosition }),
      fireDirection: crossProduct(Vector.normalize(firePosition), Z_AXIS),
    });

    const id = uuidV1();
    store[id] = {
      x: firework.position.x,
      y: firework.position.y,
    };

    const keyframe = {
      targets: store[id],
      update: this.renderParticule,
      easing: 'easeInOutQuad',
      x: [],
      y: [],
    };

    const age = firework.age;
    const secDuration = 0.1;

    while (firework.age > 0) {
      firework.update(secDuration);
      keyframe.x.push({ value: firework.position.x, duration: secDuration * 1000 });
      keyframe.y.push({ value: firework.position.y, duration: secDuration * 1000 });
    }

    anime(keyframe).finished
      .then(() => {
        delete store[id];
      });

    return this;
  }

  onFireExpire(type, id) {

    // delete test;
  }

  renderParticule(anim) {
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    const keys = Object.keys(store);

    for (var i = 0; i < keys.length; i++) {
      const firework = store[keys[i]];
      this.ctx.beginPath();
      this.ctx.arc(this.canvasEl.width / 2 + firework.x * 1, this.canvasEl.height / 2 + firework.y * 1, 3, 0, 2 * Math.PI, true);
      this.ctx.fillStyle = '#FF1461';
      this.ctx.fill();
    }
  }
}

export default CatherineWheel;
