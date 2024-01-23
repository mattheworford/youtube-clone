import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

interface VideoProcessingRequestBody {
  inputFilePath: string;
  outputFilePath: string;
}

interface Error {
  message: string;
}

export function processVideo(
  req: express.Request<object, object, VideoProcessingRequestBody>,
  res: express.Response
) {
  const { inputFilePath, outputFilePath } = req.body;

  if (!inputFilePath) {
    return res.status(400).send('Bad Request: Missing `inputFilePath`.');
  }

  if (!outputFilePath) {
    return res.status(400).send('Bad Request: Missing `outputFilePath`.');
  }

  if (!fs.existsSync(inputFilePath)) {
    return res
      .status(400)
      .send(`Bad Request: File not found at ${inputFilePath}.`);
  }

  ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360')
    .on('end', function () {
      const successMessage = `Successfully processed ${inputFilePath}`;
      console.log(successMessage);
      res.status(200).send(successMessage);
    })
    .on('error', function (err: Error) {
      const errorMessage = `An error occurred: ${err.message}`;
      console.error(errorMessage);
      res.status(500).send(errorMessage);
    })
    .run();
}
