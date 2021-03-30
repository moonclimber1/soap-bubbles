

import Victor from 'victor';
import Q5 from "./assets/q5.js";

const CIRCLE_RADIUS = 100;
const NOISE_OFFSET = 150;

const DRAG_FACTOR = 0.01;
const PULL_FACTOR = 0.00000002;

const STATIC_Q5 = new Q5(window.document, 'offscreen');

class Bubble {
  constructor(id, startPos, pullEnabled, pullPoint, staticQ5) {
    this.id = id;
    this.imagePath = "";

    this.pos = new Victor(startPos.x, startPos.y)
    this.velocity = new Victor(0,0);
    this.noiseOffset = new Victor(0,0);

    this.pullEnabled = pullEnabled;
    this.pullPoint = new Victor(pullPoint.x, pullPoint.y);

    this.staticQ5 = staticQ5;

    this.physicsTimer = setInterval(this.updatePhysics.bind(this), 17);
    this.frame = 0;

    const C1 =  STATIC_Q5.color(34,193,195);
    const C2 = STATIC_Q5.color(253,187,45);
    this.color = STATIC_Q5.lerpColor(C1, C2, Math.random());
  }

  applyForce(forceVector) {
    this.velocity.add(forceVector);
  }

  updatePhysics() {

     // apply drag force
    const antiVelocity = this.velocity.clone().multiplyScalar(-1).normalize()
    const dragForce = this.velocity.clone().multiply(this.velocity).multiply(antiVelocity).multiplyScalar(DRAG_FACTOR)
    this.applyForce(dragForce) 
 
     // apply pull force
     if (this.pullEnabled){
        const dirVec = this.pullPoint.clone().subtract(this.pos).normalize()
        const distSq = this.pos.distanceSq(this.pullPoint)
        const pullForce = dirVec.multiplyScalar(PULL_FACTOR * distSq)
        // console.log("🚀 ~ file: Bubble.js ~ line 40 ~ Bubble ~ updatePhysics ~ pullForce", pullForce)
        this.applyForce(pullForce);
     }

    // Apply everything to position
    this.pos.add(this.velocity)

     // Calculate noise offset
    this.noiseOffset.x = (STATIC_Q5.noise(this.frame/1500)-0.5) * NOISE_OFFSET
    this.noiseOffset.y = (STATIC_Q5.noise(this.frame/750)-0.5) * NOISE_OFFSET

    // update frame count
    this.frame += 1
  }

  draw(q5){
    q5.fill(this.color)
    q5.noStroke()
    let x = this.pos.x + this.noiseOffset.x
    let y = this.pos.y + this.noiseOffset.y
    q5.ellipse(x, y, CIRCLE_RADIUS*2, CIRCLE_RADIUS*2)
  }
}

export default Bubble;
