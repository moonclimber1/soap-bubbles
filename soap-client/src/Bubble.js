

import Victor from 'victor';

const CIRCLE_RADIUS = 150;
const NOISE_OFFSET = 150;

const DRAG_FACTOR = 0.01;
const PULL_FACTOR = 0.00000002;

let pos, velocity, gravity, pullPoint;

class Bubble {
  constructor(startPos, pullEnabled, pullPoint) {
    this.pos = startPos.clone();
    this.velocity = new Victor(0,0);

    this.pullEnabled = pullEnabled;
    this.pullPoint = pullPoint;
  }

  applyForce(forceVector) {
    this.velocity.add(forceVector);
  }

  updatePhysics(currentTime) {
    if (!this.startingTime) this.startingTime = currentTime;
    const totalTime = currentTime - this.startingTime;

     // apply drag force
    const antiVelocity = this.velocity.clone().multiplyScalar(-1).normalize()
    const dragForce = this.velocity.clone().multiply(this.velocity).multiply(antiVelocity).multiplyScalar(DRAG_FACTOR)
    this.velocity.add(dragForce)
 
     // apply pull force
     if (this.pullEnabled){
        const dirVec = this.pullPoint.clone().subtract(this.pos).normalize()
        const distSq = this.pos.distanceSq(this.pullPoint)
        const pullForce = dirVec.multiplyScalar(PULL_FACTOR * distSq)
        console.log("🚀 ~ file: Bubble.js ~ line 40 ~ Bubble ~ updatePhysics ~ pullForce", pullForce)
        this.velocity.add(pullForce); 
     }

    // Apply everything to position
    this.pos.add(this.velocity)
  }
}

export default Bubble;
