import anime from 'animejs';
import { Vector } from 'vectorious';
import uuidV1 from 'uuid/v1';
import _ from 'lodash';
import times from 'lodash/times';
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

const rules = {
  1: new FireworkRule({
    type: 1,
    minAge: 1.5,
    maxAge: 2.5,
    minVelocity: new Vector([0, 0, 0]),
    maxVelocity: new Vector([1000, 1000, 0]),
    damping: 0.1,
    payloads: [
      new Payload({ type: 2, count: 4 }),
    ],
  }),
  2: new FireworkRule({
    type: 2,
    minAge: 0.5,
    maxAge: 1,
    minVelocity: new Vector([-10, -10, 0]),
    maxVelocity: new Vector([10, 10, 0]),
    damping: 0.2,
    payloads: [],
  }),
};

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

  fire({ parent, type, isWheelFire = false }) {
    const firework = rules[type].create({
      parent: new Particle({ position: parent }),
      fireDirection: isWheelFire ? crossProduct(Vector.normalize(parent), Z_AXIS) : null,
    });

    const id = uuidV1();
    store[id] = {
      x: firework.position.x,
      y: firework.position.y,
      // color: type === 1 ? '#FF1461' : '#FFFFFF',
      color: '#FF1461',
    };

    const keyframe = {
      targets: store[id],
      update: this.renderParticule,
      easing: 'easeInOutQuad',
      x: [],
      y: [],
    };

    const secDuration = 0.1;

    while (firework.age > 0) {
      firework.update(secDuration);
      keyframe.x.push({ value: firework.position.x, duration: secDuration * 1000 });
      keyframe.y.push({ value: firework.position.y, duration: secDuration * 1000 });
    }
    anime(keyframe).finished
      .then(() => {
        this.onFireExpire({ type, id });
      });
    return this;
  }

  onFireExpire({ type, id }) {
    const payloads = rules[type].payloads;

    payloads.forEach(
      payload => _.times(payload.count, () => {
        this.fire({
          parent: new Vector([store[id].x, store[id].y, 0]),
          type: payload.type,
        });
      })
    );

    delete store[id];
  }

  getWheelPosition() {
    const deg = this.deg + anime.random(-5, 5);

    const radian = deg * Math.PI / 180;
    return new Vector([this.radius * Math.cos(radian), this.radius * Math.sin(radian), 0]);
  }

  renderParticule(type) {
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    const keys = Object.keys(store);
    for (var i = 0; i < keys.length; i++) {
      const firework = store[keys[i]];
      this.ctx.beginPath();
      this.ctx.arc(this.canvasEl.width / 2 + firework.x * 1, this.canvasEl.height / 2 + firework.y * 1, 3, 0, 2 * Math.PI, true);
      // console.log(firework);
      this.ctx.fillStyle = firework.color;
      this.ctx.fill();
    }
  }
}

export default CatherineWheel;
