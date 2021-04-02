

import Victor from 'victor';
import Q5 from "./assets/q5.js";

const CIRCLE_RADIUS = 300;
const NOISE_OFFSET = 200;

const DRAG_FACTOR = 0.01;
const PULL_FACTOR = 0.00000002;

const STATIC_Q5 = new Q5(window.document, 'offscreen');

class Bubble {
  constructor(id, startPos, pullEnabled, pullPoint) {
    this.id = id;
    this.imagePath = "";

    this.pos = new Victor(startPos.x, startPos.y)
    this.velocity = new Victor(0,0);
    this.noiseOffset = new Victor(0,0);

    this.pullEnabled = pullEnabled;
    this.setPullPoint(pullPoint);

    this.physicsTimer = setInterval(this.updatePhysics.bind(this), 17);
    this.frame = 0;

    const C1 =  STATIC_Q5.color(34,193,195);
    const C2 = STATIC_Q5.color(253,187,45);
    this.color = STATIC_Q5.lerpColor(C1, C2, Math.random());

    this.t = 0
  }

  static createFromBubble(bubble){
    const newBubble = new Bubble(bubble.id, bubble.pos, bubble.pullEnabled, bubble.pullPoint);
    newBubble.imagePath = bubble.imagePath
    newBubble.velocity = new Victor(bubble.velocity.x, bubble.velocity.y);
    newBubble.noiseOffset = bubble.noiseOffset;
    newBubble.frame = bubble.frame;
    newBubble.color = STATIC_Q5.color(bubble.color._r,bubble.color._g,bubble.color._b)
    return newBubble;
  }

  setPullPoint(pullPoint){
    this.pullPoint = new Victor(pullPoint.x, pullPoint.y);
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
    this.noiseOffset.x = (STATIC_Q5.noise(this.frame/1200)-0.5) * NOISE_OFFSET
    this.noiseOffset.y = (STATIC_Q5.noise(this.frame/600)-0.5) * NOISE_OFFSET

    // update frame count
    this.frame += 1
  }

  draw(q5){
    q5.fill(this.color)
    q5.noStroke()
    let xPos = this.pos.x + this.noiseOffset.x
    let yPos = this.pos.y + this.noiseOffset.y
    // q5.ellipse(xPos, yPos, CIRCLE_RADIUS*2, CIRCLE_RADIUS*2)

    // Draw Wobbly Circle

    

    const POINTS_NUMBER = 200;
    const step = q5.TWO_PI / POINTS_NUMBER;
    let x, y, noiseMultiplier
    q5.beginShape()
    for (let angle = 0; angle < q5.TWO_PI; angle += step) {
        x = q5.cos(angle)
        y = q5.sin(angle)
        const noise = q5.map(q5.noise(x,y), 0,1, -1, 1)
        const unitVec = new Victor(x,y)
        const point = new Victor(x,y).multiplyScalar(CIRCLE_RADIUS * noise)
        


        q5.vertex(xPos + point.x, yPos + y + point.y)
    }
    q5.endShape(q5.CLOSE)


    // const nPoints = 300
    // const angle = q5.TWO_PI / nPoints
    // this.t += 0.01;

    // let x,y,p,n;
 
    // q5.beginShape()
    // // q5.strokeWeight(4)
    // for (let i = 0; i <= nPoints; i +=1 ) {
    //     x = q5.cos(angle * i) * CIRCLE_RADIUS
    //     console.log("🚀 ~ file: Bubble.js ~ line 100 ~ Bubble ~ draw ~ x", x)
    //     y = q5.sin(angle * i) * CIRCLE_RADIUS 
    //     console.log("🚀 ~ file: Bubble.js ~ line 102 ~ Bubble ~ draw ~ y", y)
    //     p = new Victor(x,y).normalize()
    //     n = q5.map(q5.noise(p.x + this.t, p.y + this.t), 0, 1, 70, 120)
    //     p.multiplyScalar(n*2)
    //     q5.vertex(xPos + p.x, yPos + p.y)
    // }
    // q5.endShape(q5.CLOSE)
  }


}

export default Bubble;
