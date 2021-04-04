import Victor from "victor";
import Q5 from "./assets/q5.js";

const CIRCLE_RADIUS = 100;
const NOISE_OFFSET = 200;

const POINTS_NUMBER = 200;
const WOBBLE_RADIUS = CIRCLE_RADIUS / 3

const DRAG_FACTOR = 0.01;
const PULL_FACTOR = 0.00000002;

const STATIC_Q5 = new Q5(window.document, "offscreen");

class Bubble {
  constructor(id, startPos, pullEnabled, pullPoint, imagePath) {
    this.id = id;
    this.imagePath = imagePath;

    // STATIC_Q5.loadImage(imagePath, img => {
    //   console.log("image loaded!!!")
    //   this.image = img;
    // })

    // const self = this
    // STATIC_Q5.preload = () => {
    //   console.log("image loaded!!!")
    //   self.image = STATIC_Q5.loadImage(imagePath)
    // }

    // this.image = STATIC_Q5.createImage(100,100)
    // console.log("🚀 ~ file: Bubble.js ~ line 32 ~ Bubble ~ constructor ~ his.image ", this.image )

    // for (let i = 0; i < this.image.width; i++) {
    //   for (let j = 0; j < this.image.height; j++) {
    //     this.image.set(i, j, STATIC_Q5.color(0, 90, 102));
    //   }
    // }
    // this.image.updatePixels();



    this.pos = new Victor(startPos.x, startPos.y);
    this.velocity = new Victor(0, 0);
    this.noiseOffset = new Victor(0, 0);

    this.pullEnabled = pullEnabled;
    this.setPullPoint(pullPoint);

    this.physicsTimer = setInterval(this.updatePhysics.bind(this), 17);
    this.frame = 0;

    const C1 = STATIC_Q5.color(34, 193, 195);
    const C2 = STATIC_Q5.color(253, 187, 45);
    this.color = STATIC_Q5.lerpColor(C1, C2, Math.random());

    this.t = 0;
  }

  static createFromBubble(bubble) {
    const newBubble = new Bubble(bubble.id, bubble.pos, bubble.pullEnabled, bubble.pullPoint);
    newBubble.imagePath = bubble.imagePath;
    newBubble.velocity = new Victor(bubble.velocity.x, bubble.velocity.y);
    newBubble.noiseOffset = bubble.noiseOffset;
    newBubble.frame = bubble.frame;
    newBubble.color = STATIC_Q5.color(bubble.color._r, bubble.color._g, bubble.color._b);
    return newBubble;
  }

  setPullPoint(pullPoint) {
    this.pullPoint = new Victor(pullPoint.x, pullPoint.y);
  }

  applyForce(forceVector) {
    this.velocity.add(forceVector);
  }

  updatePhysics() {
    // apply drag force
    const antiVelocity = this.velocity.clone().multiplyScalar(-1).normalize();
    const dragForce = this.velocity.clone().multiply(this.velocity).multiply(antiVelocity).multiplyScalar(DRAG_FACTOR);
    this.applyForce(dragForce);

    // apply pull force
    if (this.pullEnabled) {
      const dirVec = this.pullPoint.clone().subtract(this.pos).normalize();
      const distSq = this.pos.distanceSq(this.pullPoint);
      const pullForce = dirVec.multiplyScalar(PULL_FACTOR * distSq);
      // console.log("🚀 ~ file: Bubble.js ~ line 40 ~ Bubble ~ updatePhysics ~ pullForce", pullForce)
      this.applyForce(pullForce);
    }

    // Apply everything to position
    this.pos.add(this.velocity);

    // Calculate noise offset
    this.noiseOffset.x = (STATIC_Q5.noise(this.frame / 1200) - 0.5) * NOISE_OFFSET;
    this.noiseOffset.y = (STATIC_Q5.noise(this.frame / 600) - 0.5) * NOISE_OFFSET;

    // update frame count
    this.frame += 1;
  }

  draw(q5) {
    
    // Calculate noise offset position
    let xPos = this.pos.x + this.noiseOffset.x;
    let yPos = this.pos.y + this.noiseOffset.y;
    

    // Draw Wobbly Circle

    // q5.fill(this.color);
    // q5.noStroke();

    // const shapeLength = (CIRCLE_RADIUS + WOBBLE_RADIUS) * 2
    // const shape = q5.createGraphics(shapeLength, shapeLength)
    // shape.fill(0)
    // shape.noStroke();

    // const step = q5.TWO_PI / POINTS_NUMBER;
    // let x, y, noise;
    // let p = new Victor(0, 0);
    // shape.beginShape();
    // for (let angle = 0; angle < q5.TWO_PI; angle += step) {
    //   p.x = q5.cos(angle);
    //   p.y = q5.sin(angle);
    //   noise = q5.map(q5.noise(p.x * 0.25 + 1 + this.frame / 500, p.y * 0.25 + 1 + this.frame / 500),0,1, -WOBBLE_RADIUS, WOBBLE_RADIUS);
    //   p.multiplyScalar(CIRCLE_RADIUS + noise);
    //   shape.vertex(shapeLength/2 + p.x, shapeLength/2 + p.y);
    // }
    // shape.endShape(q5.CLOSE);
    // q5.image(shape, xPos -shapeLength/2 , yPos - shapeLength/2)

  }
   
}

export default Bubble;
