import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

interface VideoProcessingRequestBody {
  inputFilePath: string;
  outputFilePath: string;
}

const app = express();
app.use(express.json());

app.post('/process-video', (req: express.Request<{}, {}, VideoProcessingRequestBody>, res) => {
  const { inputFilePath, outputFilePath } = req.body;

  if (!inputFilePath) {
    return res.status(400).send('Bad Request: Missing input file path.');
  }
  
  if (!outputFilePath) {
    return res.status(400).send('Bad Request: Missing output file path.');
  }

  if (!fs.existsSync(inputFilePath)) {
    return res.status(400).send(`Bad Request: File does not exist at ${inputFilePath}.`);
  }

  ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360')
    .on('end', function() {
        console.log('Processing finished successfully');
        res.status(200).send('Processing finished successfully');
    })
    .on('error', function(err: any) {
        console.log('An error occurred: ' + err.message);
        res.status(500).send('An error occurred: ' + err.message);
    })
    .save(outputFilePath);
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});