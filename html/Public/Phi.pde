
float PHI = (1+sqrt(5))*0.5;
color BG = color(128);

float prevX = 125,
  prevY = 150,
  prevW = 150,
  prevH = prevW*(PHI-1);
int prevD = 0;
color prevC = color(128,128,128,64);
float prevAmp = 0.5;
PSound zin, zout;

void setup() 
{
  size(400, 400);
  ellipseMode(CENTER_RADIUS);
  background(BG);
  //zin = loadSound("bottle-open.wav");
  zout = loadSound("whistle.wav");
  //framerate(10);
}

color perturb(color c, int d) {
  return color(red(c)+random(-d,d),green(c)+random(-d,d),
    blue(c)+random(-d,d),alpha(c));
}

void next() {
  if(random(2)<1) {
    //print("SHRINK"+prevD+"\n");
    if(prevD==0||prevD==2) {
      if(prevD==0)
        prevX += prevH;
      prevW = prevH*(PHI-1);
    }
    else {
      if(prevD==1)
        prevY += prevW;
      prevH = prevW*(PHI-1);
    }
    prevD++;
    if(prevD==4)
      prevD=0;
    prevAmp = constrain(prevAmp-0.1,0,1);
  }
  else {
    //print("GROW"+prevD+"\n");
    if(prevD==0||prevD==2) {
      if(prevD==2)
        prevY -= prevW;
       prevH = prevW*PHI;
    }
    else {
      if(prevD==1)
        prevX -= prevH;
      prevW = prevH*PHI;
    }
    prevD--;
    if(prevD==-1)
      prevD=3;
    prevAmp = constrain(prevAmp+0.1,0,1);
  }
}

void draw() 
{
  stroke(0);
  noFill();
  rect(prevX,prevY,prevW,prevH);
  next();
  if(prevW>width||prevH>height) {
    copy(0,0,width,height,width/4,height/4,width/2,height/2);
    noStroke();
    fill(BG);
    rect(0,0,width,height/4);
    rect(0,height/4,width/4,3*height/4);
    rect(3*width/4,height/4,width/4,3*height/4);
    rect(width/4,3*height/4,width/2,height/4);
    prevX=width/4+prevX*0.5;
    prevY=height/4+prevY*0.5;
    prevW*=0.5;
    prevH*=0.5;
    prevC = color(random(255),random(255),random(255),alpha(prevC));
    prevAmp = constrain(prevAmp-0.1,0,1);
  }
  else if(prevW<5||prevH<5) {
    copy(round(prevX-width/4),round(prevY-height/4),width/2,height/2,0,0,width,height);
    prevX=width/2;
    prevY=height/2;
    prevW*=2;
    prevH*=2;
    prevC = color(random(255),random(255),random(255),alpha(prevC));
    prevAmp = constrain(prevAmp+0.1,0,1);
  }
  else
    prevC = perturb(prevC, 20);
  zout.stop();
  zout.volume(max(prevW/width,prevH/height));
  zout.play();
  noStroke();
  fill(prevC);
  rect(prevX,prevY,prevW,prevH);
  stroke(0);
  noFill();
  if(prevD==0)
    arc(prevX+prevH,prevY+prevH,prevH,prevH,PI,3*HALF_PI);
  else if(prevD==1)
    arc(prevX,prevY+prevW,prevW,prevW,3*HALF_PI,TWO_PI);
  else if(prevD==2)
    arc(prevX+prevW-prevH,prevY,prevH,prevH,0,HALF_PI);
  else if(prevD==3)
    arc(prevX+prevW,prevY+prevH-prevW,prevW,prevW,HALF_PI,PI);
  stroke(random(255),random(255),random(255));
  rect(prevX,prevY,prevW,prevH);
}

