const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const buffer = ctx.createImageData(canvas.width, canvas.height);
var data;
var k = 0;

const loop = (t) => {
  const x = Math.random() * 255;
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const k = ( t / 10 ) % 255;
      if (data[i + c] >= k) buffer.data[i + c] = 255;
      else buffer.data[i + c] = 0;
    }
  }
  ctx.putImageData(buffer, 0, 0);
  k = (k + 1) % 256;
  requestAnimationFrame(loop);
};

const img = document.createElement('img');
img.addEventListener('load', () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (var i = 0; i < data.length; i += 4) {
    // data[i] = data[i + 1] = data[i + 2] = (data[i] + data[i + 1] + data[i + 2]) / 3;
    buffer.data[i + 3] = 255;
  }
  requestAnimationFrame(loop);
});
img.src = 'shanghai.jpg';
