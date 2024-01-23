import express from 'express';
import dotenv from 'dotenv';
import { body, validationResult, matchedData } from 'express-validator';
import { scaleVideo } from './videoProcessing';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.post(
  '/process-video',
  body('inputFilePath', 'outputFilePath').notEmpty(),
  (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = matchedData(req);
      scaleVideo(data.inputFilePath, data.outputFilePath)
        .then((successMessage: string) => {
          console.log(successMessage);
          res.status(200).send(successMessage);
        })
        .catch((errorMessage: string) => {
          console.error(errorMessage);
          res.status(500).send(errorMessage);
        });
    }

    res.status(400).send({ errors: result.array() });
  }
);
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
