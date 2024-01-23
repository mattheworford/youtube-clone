import express from 'express';
import dotenv from 'dotenv';
import { processVideo } from './videoProcessing';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.post('/process-video', processVideo);
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
