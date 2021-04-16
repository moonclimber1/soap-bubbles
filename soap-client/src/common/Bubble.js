import Victor from "victor";
import Q5 from "../assets/q5.js";

const CIRCLE_RADIUS = 70;
const POINTS_NUMBER = 100;
const WOBBLE_RADIUS = CIRCLE_RADIUS

const BUBBLE_SIZE = (CIRCLE_RADIUS + WOBBLE_RADIUS*0.8) * 2

const POSITION_NOISE_OFFSET = 200;

const DRAG_FACTOR = 0.01;
const PULL_FACTOR = 0.00000002;

const STATIC_Q5 = new Q5(window.document, "offscreen");

class Bubble {
  constructor(id, startPos, pullEnabled, pullPoint, imageLibrary) {
    this.id = id;
    this.imageLibrary = imageLibrary;
    
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
  }

  static createFromBubble(bubble) {
    const newBubble = new Bubble(bubble.id, bubble.pos, bubble.pullEnabled, bubble.pullPoint, bubble.imageLibrary);
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

  isAboveTop(){
    const yPos = this.pos.y + this.noiseOffset.y;
    return (yPos < - BUBBLE_SIZE/2)
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
      this.applyForce(pullForce);
    }

    // Apply everything to position
    this.pos.add(this.velocity);

    // Calculate noise offset
    this.noiseOffset.x = (STATIC_Q5.noise(this.frame / 1200) - 0.5) * POSITION_NOISE_OFFSET;
    this.noiseOffset.y = (STATIC_Q5.noise(this.frame / 600) - 0.5) * POSITION_NOISE_OFFSET;

    // update frame count
    this.frame += 1;
  }

  drawBackgroundWobble(q5, xPos, yPos){
    const ctx = q5.drawingContext;
    const step = q5.TWO_PI / POINTS_NUMBER;
    let noise;
    let p = new Victor(0, 0);
    ctx.beginPath();
    for (let angle = 0; angle < q5.TWO_PI; angle += step) {
      p.x = q5.cos(angle);
      p.y = q5.sin(angle);
      noise = q5.map(q5.noise(p.x * 0.25 + 100 + this.frame / 421, p.y * 0.25 + 66 + this.frame / 377),0,1, 0, WOBBLE_RADIUS*1.6);
      p.multiplyScalar(CIRCLE_RADIUS * 0.8 + noise);
      if(angle ===  0){
        ctx.moveTo(xPos + p.x, yPos + p.y)
      }else{
        ctx.lineTo(xPos + p.x, yPos + p.y)
      }
    }
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill()
  }

  draw(q5) {
    
    // Calculate noise offset position
    let xPos = this.pos.x + this.noiseOffset.x;
    let yPos = this.pos.y + this.noiseOffset.y;
    
    this.drawBackgroundWobble(q5, xPos, yPos)

    // Draw Wobbly Circle

    // Get canvas context from Q5
    const ctx = q5.drawingContext;

    // Save state
    ctx.save();
    
    const step = q5.TWO_PI / POINTS_NUMBER;
    let noise;
    let p = new Victor(0, 0);
    ctx.beginPath();
    for (let angle = 0; angle < q5.TWO_PI; angle += step) {
      p.x = q5.cos(angle);
      p.y = q5.sin(angle);
      noise = q5.map(q5.noise(p.x * 0.25 + 1 + this.frame / 500, p.y * 0.25 + 1 + this.frame / 500),0,1, 0, WOBBLE_RADIUS);
      p.multiplyScalar(CIRCLE_RADIUS + noise);
      if(angle ===  0){
        ctx.moveTo(xPos + p.x, yPos + p.y)
      }else{
        ctx.lineTo(xPos + p.x, yPos + p.y)
      }
    }
    ctx.closePath();
    
  

    // Draw clipped image
    ctx.clip()
    const img = this.imageLibrary.getImage(this.id)

    if (img){

      let x, y, width, height;

      if(img.width < img.height){
        // Hochformat
        width = BUBBLE_SIZE
        height = (BUBBLE_SIZE / img.width) * img.height
        x = xPos - BUBBLE_SIZE / 2
        y = yPos - height / 2

      }else{
        // Querformat
        width = (BUBBLE_SIZE / img.height) * img.width
        height = BUBBLE_SIZE
        x = xPos - width / 2
        y = yPos - BUBBLE_SIZE / 2
      }
      ctx.drawImage(img, x , y, width, height)
    }

    // Draw Outline
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'white'
    ctx.stroke();

    // Reset clip
    ctx.restore();
  }
}

export default Bubble;
