import {
  deleteLocalFile,
  downloadFromGcs,
  initLocalDirectory,
  uploadToGcs
} from '../src/storage';
import fs from 'fs';
import { Storage } from '@google-cloud/storage';

jest.mock('@google-cloud/storage', () => ({
  Storage: jest.fn().mockReturnValue({
    bucket: jest.fn().mockReturnValue({
      file: jest.fn().mockReturnValue({
        download: jest.fn(),
        makePublic: jest.fn()
      }),
      upload: jest.fn()
    })
  })
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  unlink: jest.fn()
}));

console.log = jest.fn();

describe('downloadFromGcs', () => {
  it('should download file from GCS to local destination', async () => {
    const fileName = 'example.txt';
    const bucketName = 'example-bucket';
    const destination = './downloads';

    await downloadFromGcs(fileName, bucketName, destination);

    expect(Storage).toHaveBeenCalledWith();
    expect(new Storage().bucket).toHaveBeenCalledWith(bucketName);
    expect(new Storage().bucket(bucketName).file).toHaveBeenCalledWith(
      fileName
    );
    expect(
      new Storage().bucket(bucketName).file(fileName).download
    ).toHaveBeenCalledWith({
      destination: destination
    });

    expect(console.log).toHaveBeenCalledWith(
      `${fileName} downloaded from gs://${bucketName}/${fileName} to ${destination}.`
    );
  });
});

describe('uploadToGcs', () => {
  it('should upload file from local directory to GCS', async () => {
    const fileName = 'example.txt';
    const localDirectory = './uploads';
    const bucketName = 'example-bucket';

    await uploadToGcs(fileName, localDirectory, bucketName);

    expect(Storage).toHaveBeenCalledWith();
    expect(new Storage().bucket).toHaveBeenCalledWith(bucketName);
    expect(new Storage().bucket(bucketName).upload).toHaveBeenCalledWith(
      `${localDirectory}/${fileName}`,
      { destination: 'example.txt' }
    );
    expect(
      new Storage().bucket(bucketName).file(fileName).makePublic
    ).toHaveBeenCalled();

    expect(console.log).toHaveBeenCalledWith(
      `${fileName} uploaded from ${localDirectory} to gs://${bucketName}/${fileName}.`
    );
  });
});

describe('deleteLocalFile', () => {
  beforeEach(() => {
    (fs.existsSync as jest.Mock).mockClear();
    (fs.unlink as unknown as jest.Mock).mockClear();
  });

  it('resolves if the file exists and is successfully deleted', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.unlink as unknown as jest.Mock).mockImplementation((path, callback) => {
      callback(null);
    });

    await expect(deleteLocalFile('file.txt')).resolves.toBeUndefined();
    expect(fs.existsSync).toHaveBeenCalledWith('file.txt');
    expect(fs.unlink).toHaveBeenCalledWith('file.txt', expect.any(Function));
  });

  it('resolves if the file does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await expect(deleteLocalFile('file.txt')).resolves.toBeUndefined();
    expect(fs.existsSync).toHaveBeenCalledWith('file.txt');
    expect(fs.unlink).not.toHaveBeenCalled();
  });

  it('rejects if an error occurs while deleting the file', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const error = new Error('Failed to delete file');
    (fs.unlink as unknown as jest.Mock).mockImplementation((path, callback) => {
      callback(error);
    });

    await expect(deleteLocalFile('file.txt')).rejects.toEqual(error);
    expect(fs.existsSync).toHaveBeenCalledWith('file.txt');
    expect(fs.unlink).toHaveBeenCalledWith('file.txt', expect.any(Function));
  });
});

describe('initLocalDirectory', () => {
  beforeEach(() => {
    (fs.existsSync as jest.Mock).mockClear();
    (fs.mkdirSync as jest.Mock).mockClear();
  });

  it('should not initialize local directory if it already exists', () => {
    const path = './uploads';

    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);

    initLocalDirectory(path);

    expect(fs.existsSync).toHaveBeenCalledWith(path);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  it('should initialize local directory if it does not exist', () => {
    const path = './uploads';

    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

    initLocalDirectory(path);

    expect(fs.existsSync).toHaveBeenCalledWith(path);
    expect(fs.mkdirSync).toHaveBeenCalledWith(path, { recursive: true });
  });
});
