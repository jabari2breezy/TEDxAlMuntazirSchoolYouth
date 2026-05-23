async function run() {
  const jimp = await import('jimp');
  console.log(jimp.default ? 'has default' : 'no default', typeof jimp.default, typeof jimp);
}
run();
