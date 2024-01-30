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
  uploadToGcs
} from './storage';

dotenv.config();

const port = process.env.PORT;
const app = express();

initLocalDirectories();

app.use(express.json());

app.post(
  '/process-video',
  body('message.data.name').notEmpty(),
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = matchedData(req);

      const inputFileName = data.message.data.name;
      const outputFileName = `processed-${inputFileName}`;

      await downloadFromGcs(
        inputFileName,
        rawVideoBucketName,
        localRawVideoDirectory
      );

      scaleVideo(inputFileName, outputFileName)
        .then(async (successMessage: string) => {
          await uploadToGcs(
            outputFileName,
            localProcessedVideoDirectory,
            processedVideoBucketName
          );

          await Promise.all([
            deleteLocalFile(`${localRawVideoDirectory}/${inputFileName}`),
            deleteLocalFile(`${localProcessedVideoDirectory}/${outputFileName}`)
          ]);

          res.status(200).send(successMessage);
        })
        .catch(async (errorMessage: string) => {
          await Promise.all([
            deleteLocalFile(`${localRawVideoDirectory}/${inputFileName}`),
            deleteLocalFile(`${localProcessedVideoDirectory}/${outputFileName}`)
          ]);
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
