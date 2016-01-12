/**
 * <p>A simple container for several static base64 methods.</p>
 * <p>One need never instantiate this class, but should simply use its
 * static methods.</p>
 */
public class Base64 {
  // table is either null or a table of base64 digit values
  // (see makeTable())
  private static byte[] table;

  // disallow instantiation
  private Base64() {}

  /**
   * <p>Decodes base64 text into a new byte array.</p>
   * <p>The base64 digits are, in ascending order, 'A'-'Z', 'a'-'z',
   * '0'-'9', '+', '/'. Since each digit represents six bits, every
   * four digits corresponds to three bytes. Thus the number of digits
   * in a valid base64 string is a multiple of four, and to encode a
   * number of bytes which is not a multiple of three, '=' is used. If
   * the last digit is '=', the last byte is dropped, and if the last
   * two digits are '=', the last two bytes are dropped.</p>
   * <p>Any non-null String is valid input for this method, although
   * the output is undefined for Strings containing '=' other than as
   * the last one or two base64 digits. All non-base64 characters are
   * simply ignored.</p>
   *
   * @param base64 a non-null String
   * @return a new byte array resulting from decoding {@code base64}
   */
  public static byte[] decodeBase64(String base64) {
    makeTable();

    // at most 3 bytes per 4 chars:
    byte[] temp = new byte[3*(base64.length()/4)],
      quad = new byte[4];

    int j=0, // number of decoded bytes
      k=0; // number of digits in current quad
    for(int i=0; i<base64.length(); i++) {
      char c = base64.charAt(i);
      if( isBase64Char(c) ) {
        quad[k++] = table[c];
        if(k==4) { // full quad?
	  // decode the 3 bytes:
          temp[j++] = (byte)((quad[0]<<2) + (quad[1]>>4));
          temp[j++] = (byte)((quad[1]<<4) + (quad[2]>>2));
          temp[j++] = (byte)((quad[2]<<6) + quad[3]);
          k = 0; // restart quad
        }
      }
    }

    // handle padding:
    if(quad[2]==table['=']) // second-to-last char was '='?
      j-=2;
    else if(quad[3]==table['=']) // last?
      j--;

    // copy into smaller array:
    byte[] data = new byte[j];
    for(int i=0;i<j;i++)
      data[i] = temp[i];

    return data;
  }

  /**
   * <p>Decodes four base64 characters as three bytes. This can be
   * useful for serially decoding a stream of input.</p>
   * <p>The decoded bytes are placed into {@code dest}, beginning at
   * the index {@code offset}. The number of decoded bytes is
   * returned.</p>
   * <p>Unlike {@link #decodeBase64(String)}, all of the inputted
   * characters are expected to be valid base64 characters. You can
   * use {@link #isBase64Char(char)} to help ensure this.</p>
   * <p>The behavior is unspecified if any of the characters are not
   * base64 digits, or if the quad is too short or improperly padded.</p>
   *
   * @param quad The input base64 digits. The first four elements must
   * 	be valid base64 chars with valid padding.
   * @param dest The destination byte array.
   * @param offset The offset into {@code dest} at which bytes will be stored.
   * @return The number of bytes decoded: 1, 2, or 3 depending on padding.
   * @see #isBase64Char(char)
   * @see #decodeBase64(String)
   */
  public static int decodeBase64Quad(char[] quad, byte[] dest, int offset) {
    makeTable();

    int b=table[quad[1]], c=table[quad[2]], n=0;
    dest[offset+n++] = (byte)((table[quad[0]]<<2) + (b>>4));
    if(quad[2]!='=') {
      dest[offset+n++] = (byte)((b<<4) + (c>>2));
      if(quad[3]!='=')
	dest[offset+n++] = (byte)((c<<6) + table[quad[3]]);
    }
    return n;
  }

  /**
   * <p>Determines whether a character is a base64 digit. Returns true
   * if the character is in the ranges 'A'-'Z', 'a'-'z', '0'-'9', or
   * is '+', '/', or '='.</p>
   * @param c the character to be checked
   * @return {@code (c>='A'&&c<='Z') || (c>='a'&&c<='z') || (c>='0'&&c<='9')
   *	|| c=='+' || c=='/' || c=='='}
   */
  public static boolean isBase64Char(char c) {
    makeTable();
    return (c>=0 && c<128 && table[c]>=0);
  }

  // returns a byte array with 128 entries, corresponding to the
  // base64 value of the first 128 unicode characters (which happens
  // to include all valid base64 digits)
  // invalid characters have the value -1, and '=' has the special value 64
  private static void makeTable() {
    if(table!=null) return;
    table = new byte[128];
    for(int i=0;i<128;i++)
      table[i] = -1; // invalid characters are negative
    byte j=0;
    char c;
    for(c='A';c<='Z';c++)
      table[c] = j++;
    for(c='a';c<='z';c++)
      table[c] = j++;
    for(c='0';c<='9';c++)
      table[c] = j++;
    table['+'] = 62;
    table['/'] = 63;
    table['='] = 64; // '=' must be valid and unique
  }
}
