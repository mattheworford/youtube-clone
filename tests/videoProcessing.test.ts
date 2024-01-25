import { scaleVideo } from '../src/videoProcessing';
import fs from 'fs';
import { jest, describe, expect, it } from '@jest/globals';
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';

jest.mock('fluent-ffmpeg', () => {
  return jest.fn(function (this: jest.Mocked<ffmpeg.FfmpegCommand>) {
    return {
      outputOptions: jest.fn().mockReturnThis(),
      save: jest.fn().mockReturnThis(),
      on: jest
        .fn()
        .mockImplementationOnce(function (
          this: jest.Mocked<ffmpeg.FfmpegCommand>,
          event: unknown,
          callback: unknown
        ) {
          if (event === 'error') {
            (callback as (err: Error) => void)(new Error('Mocked error'));
          }
          return this;
        })
        .mockImplementationOnce(function (
          this: jest.Mocked<ffmpeg.FfmpegCommand>,
          event: unknown,
          callback: unknown
        ) {
          if (event === 'end') {
            (callback as () => void)();
          }
          return this;
        })
    };
  });
});

jest.mock('fs', () => ({
  existsSync: jest.fn()
}));

describe('scaleVideo', () => {
  it('rejects with an error message if the video is not processed successfully', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    await expect(scaleVideo('input.mp4', 'output.mp4')).rejects.toEqual(
      'Successfully scaled input.mp4 to a height of 360 pixels.'
    );
  });

  it('resolves with a success message if the video is processed successfully', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    await expect(scaleVideo('input.mp4', 'output.mp4')).resolves.toEqual(
      'Successfully scaled input.mp4 to a height of 360 pixels.'
    );
  });

  it('rejects if the input file does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await expect(scaleVideo('input.mp4', 'output.mp4')).rejects.toEqual(
      'File not found at input.mp4.'
    );
  });
});
