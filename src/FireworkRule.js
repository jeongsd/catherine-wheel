import random from 'lodash/random';
import { Vector } from 'vectorious';
import Firework from './Firework';

function vectorRandom(lower, upper) {
  return new Vector([
    random(lower.x, upper.x),
    random(lower.y, upper.y),
    random(lower.z, upper.z),
  ]);
}

export class Payload {
  constructor(props) {
    const {
      type,
      count,
    } = props;

    this.type = type;
    this.count = count;
  }
}

class FireworkRule {

  constructor(props) {
    const {
      type,
      minAge,
      maxAge,
      minVelocity,
      maxVelocity,
      damping,
      payloads,
    } = props;

    this.type = type;
    this.minAge = minAge;
    this.maxAge = maxAge;
    this.minVelocity = minVelocity;
    this.maxVelocity = maxVelocity;
    this.damping = damping;
    this.payloads = payloads;
  }

  create(parent, id, fireDirection) {
    const firework = new Firework({
      type: this.type,
      age: random(this.minAge, this.maxAge),
      position: new Vector([parent.position.x, parent.position.y, parent.position.z]),
      id,
    });

    // firework.position = ;

    const velocity = new Vector([0, 0, 0]);
    velocity.add(parent.velocity);
    velocity.add(vectorRandom(this.minVelocity, this.maxVelocity));
    firework.velocity = new Vector([velocity.x, velocity.y, velocity.z]);
    // console.log(firework.velocity.x);
    // console.log(firework.velocity.y);
    // console.log(firework.velocity.z);
    firework.velocity = fireDirection.scale(-firework.velocity.magnitude());
    // console.log(firework.velocity.data);
    //
    // a.magnitude();

    firework.setMass(1);
    firework.setDamping(this.damping);

    const newAcc = (new Vector([0, -1, 0])).scale(firework.getEarthGForce());
    firework.acceleration = new Vector([newAcc.x, newAcc.y, newAcc.z]);

    firework.clearAccumulator();
    return firework;
  }
}

export default FireworkRule;
