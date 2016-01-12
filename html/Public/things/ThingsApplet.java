import javax.swing.*;
import java.awt.*;

public class ThingsApplet extends JApplet {
  private ThingsGUI things;

  public void init() {
    JButton button = new JButton("button");
    things = new ThingsGUI(button);
    JPanel south = new JPanel();
    south.add(button);
    add(things,BorderLayout.CENTER);
    add(south,BorderLayout.SOUTH);
  }

  public void start() {
    things.start();
  }

  public void stop() {
    things.stop();
  }
}
