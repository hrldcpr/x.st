import java.awt.Color;
import java.awt.Graphics;
import java.util.*;

public class Thing {
  public static final int WIDTH=600;
  public static final int HEIGHT=400;
  public static final Color BACKGROUND = new Color(0.5f, 0.5f, 0.5f);

  public static void click(int x, int y, List<Thing> things) {
    for(int i=things.size()-1;i>=0;i--) {
      Thing thing = things.get(i);
      if(Math.hypot(thing.x-x,thing.y-y)<thing.size) {
        thing.kids++;
        return;
      }
    }
    things.add( new Thing(x,y) );
  }

  public static void button(List<Thing> things) {
    for(Thing thing : things) {
      if(thing.kids==0)
        thing.kids=(int)(15*Math.random());
      if(thing.speedX==0&&thing.speedY==0) {
        thing.speedX = (int)(10*Math.random());
        thing.speedY = (int)(10*Math.random());
      }
      else
        thing.speedX=thing.speedY=0;
    }
  }

  private int x, y, size;
  private Color color;
  private int kids;
  private double theta;
  private int speedX, speedY;

  public Thing(int x, int y) {
    this.x = x; this.y = y;
    this.size = 10+(int)(90*Math.random());
    this.color = new Color((float)Math.random(), (float)Math.random(), (float)Math.random(), (float)Math.random());
    kids = 0; theta = 0.;
    speedX=speedY=0;
  }

  public void paint(Graphics g) {
    g.translate(x,y);
    Color color0 = g.getColor();
    g.setColor(color);
    double f = 1.5-0.5/(kids+1);
    g.fillRect((int)(-size*f),(int)(-size/f),(int)(2*size*f),(int)(2*size/f));
    for(int i=0;i<kids;i++) {
      g.setColor(new Color((int)(color.getRed()*Math.random()),//(i+1)/kids,
                           (int)(color.getGreen()*Math.random()),//(i+1)/kids,
                           (int)(color.getBlue()*Math.random())//(i+1)/kids)
                           ));
      double phi = theta+i*2*Math.PI/kids;
      g.fillRect((int)(size*Math.cos(phi)-size*2.0/kids),
                 (int)(size*Math.sin(phi)-size*2.0/kids),
                 4*size/kids,4*size/kids);
    }
    if(kids==0) {
      String s = "Click Me";
      java.awt.Font font0 = g.getFont();
      g.setFont(new java.awt.Font(font0.getName(),java.awt.Font.PLAIN,2*size/s.length()));
      g.setColor(Color.BLACK);
      g.drawString(s,-size/2,0);
      g.setFont(font0);
    }
    g.setColor(color0);
    g.translate(-x,-y);
  }

  public void move() {
    theta += 0.2*Math.PI/(kids+1);
    theta -= Math.floor(theta/(2*Math.PI))*(2*Math.PI);

    x += speedX; y += speedY;
    if(x>WIDTH-size) {
      x = WIDTH-size;
      speedX = -speedX;
      if(kids>0) kids--;
    }
    else if(x<size) {
      x = size;
      speedX = -speedX;
      if(kids>0) kids--;
    }
    if(y>HEIGHT-size) {
      y = HEIGHT-size;
      speedY = -speedY;
      if(kids>0) kids--;
    }
    else if(y<size) {
      y = size;
      speedY = -speedY;
      if(kids>0) kids--;
    }
  }
}
