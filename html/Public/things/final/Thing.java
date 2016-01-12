import java.awt.Color;
import java.awt.Graphics;
import java.util.*;

public class Thing {
  public static final int WIDTH=600;
  public static final int HEIGHT=400;
  public static final Color BACKGROUND = new Color(0.5f, 0.5f, 0.5f);

  public static void click(int x, int y, List<Thing> things) {
    things.add( new Thing(x,y) );
  }

  public static void button(List<Thing> things) {
  }

  private int x, y, size;
  private Color color;

  public Thing(int x, int y) {
    this.x = x; this.y = y;
    this.size = 50;
    this.color = new Color((float)0.0, (float)0.0, (float)1.0, (float)0.5);
  }

  public void paint(Graphics g) {
    g.translate(x,y);
    Color color0 = g.getColor();

    g.setColor(color);
    g.fillOval(-size,-size,2*size,2*size);

    g.setColor(color0);
    g.translate(-x,-y);
  }

  public void move() {
  }
}
