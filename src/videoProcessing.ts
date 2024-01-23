import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { Error } from './model/error';

export function scaleVideo(
  inputFilePath: string,
  outputFilePath: string,
  height: number = 360
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(inputFilePath)) {
      reject(`File not found at ${inputFilePath}.`);
    }

    ffmpeg(inputFilePath)
      .outputOptions('-vf', `scale=-1:${height.toString}`)
      .on('end', function () {
        resolve(
          `Successfully scaled ${inputFilePath} to a height of ${height.toString} pixels.`
        );
      })
      .on('error', function (err: Error) {
        reject(`An error occurred: ${err.message}.`);
      })
      .save(outputFilePath);
  });
}
