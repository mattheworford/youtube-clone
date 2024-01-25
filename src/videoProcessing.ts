import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
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
      return;
    }

    const ffmpegCommand: FfmpegCommand = ffmpeg(inputFilePath)
      .outputOptions('-vf', `scale=-1:${height}`)
      .save(outputFilePath);

    ffmpegCommand
      .on('end', () => {
        resolve(
          `Successfully scaled ${inputFilePath} to a height of ${height} pixels.`
        );
      })
      .on('error', (err: Error) => {
        reject(`An error occurred: ${err.message}.`);
      });
  });
}
