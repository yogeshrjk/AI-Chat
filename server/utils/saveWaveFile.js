const wav = require("wav");
const { PassThrough } = require("stream");

const saveWaveBuffer = (
  pcmData,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
) => {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const chunks = [];

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);

    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    writer.pipe(stream);
    writer.end(pcmData);
  });
};

module.exports = { saveWaveBuffer };
