import jimp from 'jimp';

async function run() {
  try {
    const image = new jimp(1200, 400, 0x0c1012FF);
    console.log("Image created");
    const font = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
    console.log("Font 64 loaded");
    const font32 = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
    console.log("Font 32 loaded");
  } catch (e) {
    console.error(e);
  }
}
run();
