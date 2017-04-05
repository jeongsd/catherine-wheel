import { Vector } from 'vectorious';
import invariant from 'fbjs/lib/invariant';
// https://www.wikiwand.com/en/Gravitational_constant
export const G = 6.67384e-11;

// https://www.wikiwand.com/en/Earth
// earth radius 6,371km = 6,371,000m
export const EARTH_RADIUS = 6371000;
export const EARTH_MASS = 5.9736e24;

export const EARTH_GFORCE = G * EARTH_MASS / Math.pow(EARTH_RADIUS, 2);
// Vector([0, -9.81, 0]);

class Particle {

  constructor(initValues) {
    const {
      position = new Vector([0, 0, 0]),
      velocity = new Vector([0, 0, 0]),
      acceleration = new Vector([0, 0, 0]),
      damping = 1,
      inverseMass = 1,
      mass = 1,
      forceAccum = new Vector([0, 0, 0]),
    } = initValues;

    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.damping = damping;
    this.inverseMass = mass ? 1 / mass : inverseMass;
    this.forceAccum = forceAccum;
  }

  // duration = sec
  integrate(duration) {
    if (this.inverseMass <= 0.0) {
      return this;
    }
    // console.log(this.position.data);
    this.position.add(Vector.scale(this.velocity, duration));

    const resultingAcc = new Vector([...this.acceleration.data]);
    resultingAcc.add(Vector.scale(this.forceAccum, this.inverseMass));

    this.velocity
      .add(Vector.scale(resultingAcc, duration))
      .scale(Math.pow(this.damping, duration));

    this.clearAccumulator();
    // console.log(this.position.data);
    return this;
  }

  clearAccumulator() {
    this.forceAccum.scale(0);
  }

  addForce(force) {
    this.forceAccum.add(force);
  }

  // https://www.wikiwand.com/en/Kinetic_energy
  getKineticEnergy() {
    return 0.5 * Math.pow(this.velocity, 2) * 1 / this.inverseMass;
  }

  getEarthGForce() {
    return EARTH_GFORCE * (1 / this.inverseMass);
  }

  setDamping(damping) {
    this.damping = damping;
    return this;
  }

  setMass(mass) {
    this.inverseMass = 1 / mass;
    return this;
  }
  //
  // static getGForceBetweenMasses(p1, p2) {
  //   return Math.sqrt(
  //     Math.pow(u.x - v.x, 2) +
  //     Math.pow(u.y - v.y, 2) +
  //     Math.pow(u.z - v.z, 2)
  //   );
  //   const r = Vector.getDistance(p1.position, p2.position);
  //
  //   return G * (1 / p1.inverseMass * 1 / p2.inverseMass) / Math.pow(r, 2);
  // }
}


export default Particle;
