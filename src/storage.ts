import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const storage = new Storage();

export async function downloadFromGcs(
  fileName: string,
  bucketName: string,
  destination: string
) {
  const gcsPath = `gs://${bucketName}/${fileName}`;

  await storage.bucket(bucketName).file(fileName).download({
    destination: destination
  });

  console.log(`${fileName} downloaded from ${gcsPath} to ${destination}.`);
}

export async function uploadToGcs(
  fileName: string,
  localDirectory: string,
  bucketName: string
) {
  const gcsPath = `gs://${bucketName}/${fileName}`;

  await storage.bucket(bucketName).upload(`${localDirectory}/${fileName}`, {
    destination: fileName
  });
  await storage.bucket(bucketName).file(fileName).makePublic();

  console.log(`${fileName} uploaded from ${localDirectory} to ${gcsPath}.`);
}

export function deleteLocalFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

export function initLocalDirectory(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}
