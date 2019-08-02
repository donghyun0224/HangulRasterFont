
// Initialize
const width = 256, height = 128;
const pxSz = 2;
var fCanv = document.getElementById("fontCanvas");
fCanv.width = width * pxSz;
fCanv.height = height * pxSz;
var fCanvCtx = fCanv.getContext("2d");
var fgColor = "white", bgColor = "dodgerblue";
fCanv.style.backgroundColor = bgColor;
fCanvCtx.strokeStyle = fgColor;

function placeDot(x, y, t) {
  //if(t==0) return;
  fCanvCtx.fillStyle = t>0 ? fgColor : bgColor;
  fCanvCtx.fillRect(x * pxSz, y * pxSz, pxSz, pxSz);
}

function bytePrint(x,y,data) {
  for (let i = 0, m=0b10000000; i < 8; i++,m=m>>1) {
    placeDot(x+i,y,!!(data&m));
  }
}


const jamoTable = {
  "init": ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ',
    'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
  "med": ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ',
    'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'],
  "fin": ["없음", 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ',
    'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
};
const beolTable = {
  "cho": [0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 1, 6, 3, 7, 3, 7, 3, 7, 1, 6, 2, 6, 4, 7, 4, 7, 4, 7, 2, 6, 1, 6, 3, 7, 0, 5],
  "joong": [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  "jong": [0, 2, 0, 2, 1, 2, 1, 2, 3, 0, 2, 1, 3, 3, 1, 2, 1, 3, 3, 1, 1]
}

// Font File
const hFont = atob(hFont64);
const eFont = atob(eFont64);

function hanPrint(x,y,cho, joong, jong) {
  var chobeol = beolTable["cho"][(jong != 0) + 2 * joong];
  var joongbeol = beolTable["joong"][cho] + (jong != 0)*2;
  var jongbeol = beolTable["jong"][joong];
  var chp=chobeol*20+cho+1;
  var joop=joongbeol*22+joong+1+20*8;
  var jonp=20*8+22*4+jongbeol*28+jong;
  for (let line=0; line<16; line++) {
    bytePrint(x,y+line,hFont.codePointAt(32*chp+line*2)|hFont.codePointAt(
      32*joop+line*2)|hFont.codePointAt(32*jonp+line*2));
    bytePrint(x+8,y+line,hFont.codePointAt(32*chp+line*2+1)|hFont.codePointAt(
      32*joop+line*2+1)|hFont.codePointAt(32*jonp+line*2+1));
  }
}

function jamoPrint(x,y,pos){
  for(let line=0;line<16;line++) {
    bytePrint(x,y+line,hFont.codePointAt(pos*32+line*2));
    bytePrint(x+8,y+line,hFont.codePointAt(pos*32+line*2+1));
  }
}

function engPrint(x,y,chr) {
  for(let line=0;line<16;line++) {
    bytePrint(x,y+line,eFont.codePointAt(16*chr+line));
  }
}

function printHE(cp) {
  // Check for hangul
  if (cp >= 0xAC00 && cp < 0xD7A4) // Hangul Syl.
  {
    var cho = Math.floor((cp - 0xAC00) / 588);
    var joong = Math.floor(((cp - 0xAC00) % 588) / 28);
    var jong = ((cp - 0xAC00) % 588) % 28;
    var chobeol = beolTable["cho"][(jong != 0) + 2 * joong];
    var joongbeol = beolTable["joong"][cho] + (jong != 0)*2;
    var jongbeol = beolTable["jong"][joong];
    document.getElementById("tBeol").value=(chobeol+1)+" "+(joongbeol+1)+" "+(jongbeol+1);
    hanPrint(0,0,cho, joong, jong);
    return 16;
  }
  else {
    if (cp >= 0x1100 && cp < 0x1200) // Jamo
    {
      if(cp<0x1113)
      {
        jamoPrint(0,0,cp-0x1112);
      }
      else if(cp>=0x1161 && cp<0x1176) {
        jamoPrint(0,0,cp-0x1160+20*8);
      }
      else if(cp>=0x11A8&&cp<0x11C3)
      {
        jamoPrint(0,0,cp-0x11A7+20*8+22*4);
      }
    }
    else if (cp >= 0x3130 && cp < 0x3190) // Compat. Jamo
    {
      if(cp<0x314F)
      {
        console.log(cp-0x3130);
        var conv=[0,1,2,20*8+22*4+3,3,20*8+22*4+5,20*8+22*4+6,4,5,6,
          20*8+22*4+9,20*8+22*4+10,20*8+22*4+11,20*8+22*4+12,20*8+22*4+13,20*8+22*4+14,20*8+22*4+15,7,8,9,20*8+22*4+18,10,11,12,13,13,14,15,16,17,18,19,20];
        console.log(conv[cp-0x3130]);
        jamoPrint(0,0,conv[cp-0x3130]);
      }
      else if(cp<0x3164)
      {
        jamoPrint(0,0,cp-0x314F+1+20*8);
      }
      return 16;
    }
    else if (cp >= 0 && cp < 256) {
      tty.value = "ASCII 확장";
      engPrint(0,1,cp);
      return 8;
    }
  }
}

// UTF-8 -> Johap
var chr = document.getElementById("tData");
var val = document.getElementById("tValue");
var tty = document.getElementById("tType");
chr.addEventListener("change", function () {
  if (chr.value.length == 0) return;
  // Print codepoint
  var cp = chr.value.codePointAt(0)
  val.value = "0x" + cp.toString(16).toUpperCase();
  // Check for hangul
  if (cp >= 0xAC00 && cp < 0xD7A4) // Hangul Syl.
  {
    document.getElementById("tIMF").style.visibility="visible";
    document.getElementById("tBeol").style.visibility="visible";
    tty.value = "한글 음소";
    var cho = Math.floor((cp - 0xAC00) / 588);
    var joong = Math.floor(((cp - 0xAC00) % 588) / 28);
    var jong = ((cp - 0xAC00) % 588) % 28;
    document.getElementById("tIMF").value = jamoTable["init"][cho] + "+" +
      jamoTable["med"][joong] + "+" + jamoTable["fin"][jong];
  }
  else {
    document.getElementById("tIMF").value = "";
    document.getElementById("tIMF").style.visibility="hidden";
    document.getElementById("tBeol").style.visibility="hidden";
    if (cp >= 0x1100 && cp < 0x1200) // Jamo
    {
      tty.value = "한글 자모";
    }
    else if (cp >= 0x3130 && cp < 0x3190) // Compat. Jamo
    {
      tty.value = "한글 자모 호환";
    }
    else if (cp >= 0 && cp < 256) {
      tty.value = "ASCII 확장";
    }
    else {
      return;
    }
  }
  printHE(cp);
});

//for (let chrIdx = 0; chrIdx < 10; chrIdx++) {
//  hanPrint(chrIdx*16,0,chrIdx);
//}