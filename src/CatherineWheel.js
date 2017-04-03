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


const rule = new FireworkRule({
  type: 1,
  minAge: 1.5,
  maxAge: 2.5,
  minVelocity: new Vector([0, 0, 0]),
  maxVelocity: new Vector([200, 122, 0]),
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
      firePosition = new Vector([INIT_RADIUS * Math.cos(INIT_DEG), INIT_RADIUS * Math.sin(INIT_DEG), 0]),
      canvasEl,
    } = props;

    this.radius = radius;
    this.firePosition = firePosition;
    this.deg = deg;
    this.ctx = canvasEl.getContext('2d');
    this.canvasEl = canvasEl;

    this.renderParticule = this.renderParticule.bind(this);
  }

  fire() {
    const {
      canvasEl,
      firePosition,
      radius,
    } = this;

    const radian = this.deg * Math.PI / 180;
    firePosition.x = radius * Math.cos(radian);
    firePosition.y = radius * Math.sin(radian);

    const id = uuidV1();
    const fireDirection = crossProduct(Vector.normalize(firePosition), new Vector([0, 0, 1]));
    const firework = rule.create(new Particle({ position: new Vector([...firePosition.data]) }), id, fireDirection);
    firework.onExpired = this.onFireExpire;

    this.deg++;
    store[id] = {
      x: firework.position.x,
      y: firework.position.y,
    };

    const keyframes = {
      targets: store[id],
      update: this.renderParticule,
      complete: () => {
        delete store[id];
      },
      x: [],
      y: [],
    };
    console.log(store[id]);
    const age = firework.age;
    firework.update(firework.age);
    keyframes.x.push({ value: firework.position.x, duration: age * 1000 });
    keyframes.y.push({ value: firework.position.y, duration: age * 1000 });
    // for (var duration = 0; firework.age > 0; duration += 500) {
    //   firework.update(firework.age);
    //   keyframes.x.push({ value: firework.position.x, duration: age * 1000 });
    //   keyframes.y.push({ value: firework.position.y, duration: age * 1000 });
    // }
    console.log(keyframes);
    anime.timeline()
      .add(keyframes);

    return this;
  }

  onFireExpire(type, id) {
    // console.log('onFireExpire');
    // delete test;
  }

  renderParticule(anim) {
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    const keys = Object.keys(store);

    for (var i = 0; i < keys.length; i++) {
      const firework = store[keys[i]];
      // console.log(firework.x, firework.y);
      // console.log(this.canvasEl.width / 2 + firework.x * 1, this.canvasEl.height / 2 + firework.y * 1);
      this.ctx.beginPath();
      this.ctx.arc(this.canvasEl.width / 2 + firework.x * 1, this.canvasEl.height / 2 + firework.y * 1, 10, 0, 2 * Math.PI, true);
      this.ctx.fillStyle = '#FF1461';
      this.ctx.fill();
    }
  }
}

export default CatherineWheel;
