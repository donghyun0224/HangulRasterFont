const charWidth = 8, charHeight = 16; // 글자 크기 (8*16, 한글은 double width)
const pxSz = 2; // 글자 1픽셀의 canvas에서의 크기 지정 (2배)
var columns = 32, rows = 2; // 표시 창 사이즈(16*1 글자)
const fgColor = "black", bgColor = "greenyellow"; // 색 지정
const pad = 1;
var fCanv = document.getElementById("fontCanvas");
var fCanvCtx = fCanv.getContext("2d");
var tData = document.getElementById("tData");
fCanv.width = (charWidth * columns + pad * 2) * pxSz;
fCanv.height = (charHeight * rows + pad * 2) * pxSz;
fCanv.style.backgroundColor = bgColor;
fCanvCtx.strokeStyle = fgColor;
tData.style.width = fCanv.width + "px";
// document.getElementById("tData").maxLength = columns/2;

// 정해진 위치에 점
function placeDot(x, y, t) {
  //if(t==0) return;
  fCanvCtx.fillStyle = t > 0 ? fgColor : bgColor;
  fCanvCtx.fillRect((x + pad) * pxSz, (y + pad) * pxSz, pxSz, pxSz);
}

// Canvas 지우기
function clearCanv() {
  var tmp = fCanvCtx.fillStyle;
  fCanvCtx.fillStyle = bgColor;
  fCanvCtx.fillRect(0, 0, fCanv.width, fCanv.height);
  fCanvCtx.fillStyle = tmp;
}

// Byte 형태의 데이터 출력
function bytePrint(x, y, data) {
  for (let i = 0, m = 0b10000000; i < 8; i++ , m = m >> 1) {
    placeDot(x + i, y, !!(data & m));
  }
}

// 한글 자모 테이블(디버깅용)
/*
const jamoTable = {
  "init": ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ',
    'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
  "med": ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ',
    'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'],
  "fin": ["없음", 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ',
    'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
};
*/
// 조합형 벌 수 테이블
const beolTable = {
  "cho": [0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 1, 6, 3, 7, 3, 7, 3, 7, 1, 6, 2, 6, 4, 7, 4, 7, 4, 7, 2, 6, 1, 6, 3, 7, 0, 5],
  "joong": [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  "jong": [0, 2, 0, 2, 1, 2, 1, 2, 3, 0, 2, 1, 3, 3, 1, 2, 1, 3, 3, 1, 1]
}

// 폰트 파일
var hFontFile = document.getElementById("hFF");
var eFontFile = document.getElementById("eFF");

// 기본
var hFont = atob(hFont64);
var eFont = atob(eFont64_2);

// 사용자 폰트파일 처리
hFontFile.addEventListener("change", function () {
  if (hFontFile.files.length == 0) {
    hFont = atob(hFont64);
    return;
  }
  var hFontReader = new FileReader();
  hFontReader.readAsBinaryString(hFontFile.files.item(0));
  hFontReader.addEventListener("loadend", function () {
    hFont = hFontReader.result;
    reDraw();
  });
});

eFontFile.addEventListener("change", function () {
  if (eFontFile.files.length == 0) {
    eFont = atob(eFont64_2);
    return;
  }
  var eFontReader = new FileReader();
  eFontReader.readAsBinaryString(eFontFile.files.item(0));
  eFontReader.addEventListener("loadend", function () {
    eFont = eFontReader.result;
    reDraw();
  });
});


// 한글 음소 출력
function printHan(x, y, cho, joong, jong) {
  var chobeol = beolTable["cho"][(jong != 0) + 2 * joong];
  var joongbeol = beolTable["joong"][cho] + (jong != 0) * 2;
  var jongbeol = beolTable["jong"][joong];
  var chp = chobeol * 20 + cho + 1;
  var joop = joongbeol * 22 + joong + 1 + 20 * 8;
  var jonp = 20 * 8 + 22 * 4 + jongbeol * 28 + jong;
  for (let line = 0; line < 16; line++) {
    bytePrint(x, y + line, hFont.codePointAt(32 * chp + line * 2) | hFont.codePointAt(
      32 * joop + line * 2) | hFont.codePointAt(32 * jonp + line * 2));
    bytePrint(x + 8, y + line, hFont.codePointAt(32 * chp + line * 2 + 1) | hFont.codePointAt(
      32 * joop + line * 2 + 1) | hFont.codePointAt(32 * jonp + line * 2 + 1));
  }
}

// 한글 자모 출력
function printDblWidth(x, y, pos, font) {
  for (let line = 0; line < 16; line++) {
    bytePrint(x, y + line, font.codePointAt(pos * 32 + line * 2));
    bytePrint(x + 8, y + line, font.codePointAt(pos * 32 + line * 2 + 1));
  }
}

// 영문 출력
function printSglWidth(x, y, chr, font) {
  for (let line = 0; line < 16; line++) {
    bytePrint(x, y + line, font.codePointAt(16 * chr + line));
  }
}

// 출력
function printHE(x, y, cp) {
  if (cp >= 0xAC00 && cp < 0xD7A4) // 한글 음소이면
  {
    // 초/중/종성과 각 벌수 계산
    var cho = Math.floor((cp - 0xAC00) / 588);
    var joong = Math.floor(((cp - 0xAC00) % 588) / 28);
    var jong = ((cp - 0xAC00) % 588) % 28;
    var chobeol = beolTable["cho"][(jong != 0) + 2 * joong];
    var joongbeol = beolTable["joong"][cho] + (jong != 0) * 2;
    var jongbeol = beolTable["jong"][joong];

    printHan(x, y, cho, joong, jong);
    return 2;
  }
  else {
    if (cp >= 0x1100 && cp < 0x1200) // Unicode 한글 자모
    {
      if (cp < 0x1113) { // 초성
        printDblWidth(x, y, cp - 0x1112, hFont);
      }
      else if (cp >= 0x1161 && cp < 0x1176) { // 중성
        printDblWidth(x, y, cp - 0x1160 + 20 * 8 + 20 * 1, hFont);
      }
      else if (cp >= 0x11A8 && cp < 0x11C3) { // 종성
        printDblWidth(x, y, cp - 0x11A7 + 20 * 8 + 22 * 4 + 28 * 0, hFont);
      }
      return 2;
    }
    else if (cp >= 0x3130 && cp < 0x3190) // Unicode 호환 자모
    {
      if (cp < 0x314F) { // 현대 한글
        const o1 = 20 * 1;
        const o2 = 28 * 0;
        var conv = [0 + o1, 1 + o1, 2 + o1, 20 * 8 + 22 * 4 + 3 + o2, 3 + o1,
        20 * 8 + 22 * 4 + 5 + o2, 20 * 8 + 22 * 4 + 6 + o2, 4 + o1,
        5 + o1, 6 + o1, 20 * 8 + 22 * 4 + 9 + o2, 20 * 8 + 22 * 4 + 10 + o2,
        20 * 8 + 22 * 4 + 11 + o2, 20 * 8 + 22 * 4 + 12 + o2,
        20 * 8 + 22 * 4 + 13 + o2, 20 * 8 + 22 * 4 + 14 + o2,
        20 * 8 + 22 * 4 + 15 + o2, 7 + o1, 8 + o1, 9 + o1,
        20 * 8 + 22 * 4 + 18 + o2, 10 + o1, 11 + o1, 12 + o1, 13 + o1,
        14 + o1, 15 + o1, 16 + o1, 17 + o1, 18 + o1, 19 + o1, 20 + o1];
        printDblWidth(x, y, conv[cp - 0x3130], hFont);
      }
      else if (cp < 0x3164) { // 옛한글
        // printDblWidth(x, y, cp - 0x314F + 1 + 20 * 8, hFont);
      }
      return 2;
    }
    else if (cp >= 0 && cp < 256) { // Extended ASCII
      printSglWidth(x, y, cp, eFont);
      return 1;
    }
  }
}

function printLen(cp) {
  if ((cp >= 0xAC00 && cp < 0xD7A4) || (cp >= 0x1100 && cp < 0x1200) || (cp >= 0x3130 && cp < 0x3190)) // 한글 음소이면
  {
    return 2;
  }
  else if (cp >= 0 && cp < 256) { // Extended ASCII
    return 1;
  }
  return 0;
}

clearCanv();

function reDraw() {
  clearCanv();
  if (tData.value.length == 0) {
    fCanv.height = charHeight * pxSz * rows;
  }
  var len = 0;
  var height = 1;
  for (let idx = 0; idx < tData.value.length; idx++) {
    if (tData.value.codePointAt(idx) == '\n'.codePointAt(0)) {
      height++;
      len = 0;
      continue;
    }
    if (len >= columns) {
      height++;
      len = 0;
    }
    len += printLen(tData.value.codePointAt(idx));

  }
  fCanv.height = charHeight * pxSz * Math.max(height, rows);
  for (let idx = 0, px = 0, py = 0; idx < tData.value.length; idx++) {
    const cp = tData.value.codePointAt(idx);
    console.log(px + " " + py + " " + cp);
    if (cp == '\n'.codePointAt(0)) {
      py += charHeight;
      px = 0;

      continue;
    }
    if (px >= columns * charWidth) {
      py += charHeight;
      px = 0;
    }
    px += printHE(px, py, cp) * charWidth;
  }
}

tData.onkeyup = reDraw;