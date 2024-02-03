import express from 'express';
import dotenv from 'dotenv';
import { body, validationResult, matchedData } from 'express-validator';
import { scaleVideo } from './videoProcessing';
import {
  localProcessedVideoDirectory,
  localRawVideoDirectory,
  rawVideoBucketName,
  processedVideoBucketName
} from './globals';
import {
  downloadFromGcs,
  initLocalDirectory,
  deleteLocalFile,
  uploadToGcs,
  deleteLocalFiles
} from './storage';

dotenv.config();

const port = process.env.PORT;
const app = express();

initLocalDirectories();

app.use(express.json());

app.post(
  '/process-video',
  body('message.data').notEmpty(),
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const body = matchedData(req);
      const dataJson = Buffer.from(body.message.data, 'base64').toString(
        'utf8'
      );
      const data = JSON.parse(dataJson);

      const inputFileName = data.name;
      const outputFileName = `processed-${inputFileName}`;

      await downloadFromGcs(
        inputFileName,
        rawVideoBucketName,
        localRawVideoDirectory
      );

      const localInputFilePath = `${localRawVideoDirectory}/${inputFileName}`;
      const localOutputFilePath = `${localProcessedVideoDirectory}/${outputFileName}`;

      scaleVideo(localInputFilePath, localOutputFilePath)
        .then(async (successMessage: string) => {
          await uploadToGcs(
            outputFileName,
            localProcessedVideoDirectory,
            processedVideoBucketName
          );

          deleteLocalVideoFiles;
          res.status(200).send(successMessage);
        })
        .catch(async (errorMessage: string) => {
          console.error(`Error: ${errorMessage}`);
          deleteLocalVideoFiles;
          return res.status(500).send(errorMessage);
        });
    } else {
      res.status(400).send({ errors: result.array() });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

function initLocalDirectories() {
  initLocalDirectory(localRawVideoDirectory);
  initLocalDirectory(localProcessedVideoDirectory);
}

function deleteLocalVideoFiles() {
  deleteLocalFiles([localRawVideoDirectory, localProcessedVideoDirectory]);
  initLocalDirectory(localProcessedVideoDirectory);
}
