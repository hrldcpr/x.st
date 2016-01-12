import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class ThingsGUI extends JComponent {
  public static void main(String[] args) {
    javax.swing.SwingUtilities.invokeLater(new Runnable() {
        public void run() {
          init();
        }
      });
  }

  private static void init() {
    JFrame frame = new JFrame();
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.setResizable(false);
    JButton button = new JButton("button");
    ThingsGUI things = new ThingsGUI(button);
    JPanel south = new JPanel();
    south.add(button);
    frame.add(things,BorderLayout.CENTER);
    frame.add(south,BorderLayout.SOUTH);
    frame.pack();
    frame.setVisible(true);
    things.start();
  }

  private java.util.List<Thing> things;
  private Timer timer;

  public ThingsGUI() {
    super();
    setOpaque(true);
    setDoubleBuffered(true);
    things = new java.util.LinkedList<Thing>();
    addMouseListener( new ThingMouse() );
    timer = new Timer(20, new ActionListener() {
        public void actionPerformed(ActionEvent e) {
          for(Thing thing : things)
            thing.move();
          repaint();
        }
      });
  }

  public ThingsGUI(JButton button) {
    this();
    button.addActionListener( new ActionListener() {
        public void actionPerformed(ActionEvent e) {
          Thing.button(things);
        }
      });
  }

  public void start() {
    timer.start();
  }

  public void stop() {
    timer.stop();
  }

  protected void paintComponent(Graphics g) {
    g.setColor(Thing.BACKGROUND);
    g.fillRect(0,0,getWidth(),getHeight());

    for(Thing thing : things)
      thing.paint(g);
  }

  private class ThingMouse implements MouseListener {
    public void mouseClicked(MouseEvent e) {
      Thing.click(e.getX(),e.getY(),things);
      repaint();
    }
    public void mouseEntered(MouseEvent e) {}
    public void mouseExited(MouseEvent e) {}
    public void mousePressed(MouseEvent e) {}
    public void mouseReleased(MouseEvent e) {}
  }

  public Dimension getPreferredSize() {
    return new Dimension(Thing.WIDTH, Thing.HEIGHT); }
  public Dimension getMinimumSize() {
    return new Dimension(Thing.WIDTH, Thing.HEIGHT); }
  public Dimension getMaximumSize() {
    return new Dimension(Thing.WIDTH, Thing.HEIGHT); }
}
