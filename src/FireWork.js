import Particle from '../Particle';

class Firework extends Particle {
  type: number;
  age: number;
  isExpired: bool;

  constructor(props) {
    const {
      type,
      age,
      ...restProps
    } = props;

    super(restProps);
    this.type = type;
    this.age = age;
    this.isExpired = false;
  }

  update(duration) {
    this.integrate(duration);

    this.age -= duration;
    this.isExpired = (this.age < 0) || (this.position.y < 0);
  }
}

export default Firework;
