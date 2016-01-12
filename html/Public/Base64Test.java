import java.io.*;
import java.lang.reflect.*;

public class Base64Test {
  public void bufferedTest() throws IOException {
    System.err.println("buffered decode...");
    long time = System.currentTimeMillis();

    Reader in = new InputStreamReader( System.in );

    // store input:
    StringBuffer base64 = new StringBuffer();
    for(int c=in.read(); c!=-1; c=in.read())
      base64.append((char)c);

    // decode:
    byte[] data = Base64.decodeBase64(base64.toString());

    // output:
    System.out.write(data,0,data.length);
    System.out.flush();

    time = System.currentTimeMillis() - time;
    int mem = 2*base64.length() + 3*(base64.length()/4) + data.length;
    System.err.println("run time: "+time+" ms");
    System.err.println("memory use: "+mem+" bytes");
  }

  public void serialTest() throws IOException {
    System.err.println("serial decode...");
    long time = System.currentTimeMillis();

    Reader in = new InputStreamReader( System.in );

    char[] quad = new char[4]; // four input digits
    byte[] triple = new byte[3]; // three output bytes
    int k=0;  // number of digits in current quad
    for(int c=in.read(); c!=-1; c=in.read()) {
      if(Base64.isBase64Char((char)c)) {
	quad[k++] = (char)c;
	if(k==4) { // full quad?
	  int n = Base64.decodeBase64Quad(quad,triple,0);
	  System.out.write(triple,0,n); // output (padded) triple
	  k = 0; // restart quad
	}
      }
    }
    System.out.flush();

    time = System.currentTimeMillis() - time;
    int mem = 2*quad.length+triple.length;
    System.err.println("run time: "+time+"ms");
    System.err.println("memory use: "+mem+"B");
  }

  public static void main(String[] args) {
    (new Base64Test()).test(args);
  }

  private void test(String[] args) {
    if(args.length!=1) {
      usage();
      return;
    }
    try {
      getClass().getMethod(args[0]+"Test", null).invoke(this,null);
    }
    catch(NoSuchMethodException e) {
      System.err.println("No such method: "+args[0]);
      usage();
    }
    catch(IllegalAccessException e) {
      e.printStackTrace();
    }
    catch(InvocationTargetException e) {
      e.getTargetException().printStackTrace();
    }
  }

  private void usage() {
      System.err.println("usage: java " + getClass().getName() + " <testName>");
      System.err.println("where <testName> is one of:");
      Method[] methods = getClass().getMethods();
      for(int i=0;i<methods.length;i++) {
	String name = methods[i].getName();
	if(name.endsWith("Test") && methods[i].getParameterTypes().length==0)
	  System.err.println(name.substring(0,name.length()-4));
      }
  }
}
