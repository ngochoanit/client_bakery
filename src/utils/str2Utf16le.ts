/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-spread */
/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
export const str2Utf16le = (str: string) => {
  let out: string;
  let i = 0;
  let len: number;
  let c: number;
  let char2: number;
  let char3: number;

  out = '';
  // eslint-disable-next-line prefer-const
  len = str.length;
  i = 0;
  while (i < len) {
    // eslint-disable-next-line no-plusplus
    c = str.charCodeAt(i++);
    // eslint-disable-next-line default-case
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++);
        // eslint-disable-next-line no-bitwise
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        out += str.charAt(i - 1);
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0),
        );
        break;
    }
  }

  const byteArray = new Uint8Array(out.length * 2);
  for (let i = 0; i < out.length; i++) {
    byteArray[i * 2] = out.charCodeAt(i); // & 0xff;
    byteArray[i * 2 + 1] = out.charCodeAt(i) >> 8; // & 0xff;
  }

  return String.fromCharCode.apply(String, Array.from(byteArray));
};
