import Particle from './Particle';

class Firework extends Particle {

  constructor(props) {
    const {
      type,
      age,
      id,
      ...other
    } = props;

    super(other);
    this.type = type;
    this.age = age;
    this.id = id;
  }

  update(duration) {
    this.integrate(duration);

    this.age -= duration;

  }
}

export default Firework;
