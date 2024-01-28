import { scaleVideo } from '../src/videoProcessing';
import fs from 'fs';
import { jest, describe, expect, it } from '@jest/globals';
import ffmpeg from 'fluent-ffmpeg';

jest.mock('fluent-ffmpeg', () => {
  return jest.fn().mockImplementation(() => ({
    outputOptions: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis()
  }));
});

jest.mock('fs', () => ({
  existsSync: jest.fn()
}));

describe('scaleVideo', () => {
  let mockFfmpegCommand: jest.Mocked<ffmpeg.FfmpegCommand>;

  beforeEach(() => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    mockFfmpegCommand = ffmpeg() as jest.Mocked<ffmpeg.FfmpegCommand>;
    (ffmpeg as jest.MockedFunction<typeof ffmpeg>).mockReturnValue(
      mockFfmpegCommand
    );
  });

  it('rejects if the input file does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await expect(scaleVideo('input.mp4', 'output.mp4')).rejects.toEqual(
      'File not found at input.mp4.'
    );
  });

  it('resolves with a success message if the video is processed successfully', async () => {
    jest.spyOn(mockFfmpegCommand, 'on').mockImplementation(function (
      this: jest.Mocked<ffmpeg.FfmpegCommand>,
      event: unknown,
      callback: unknown
    ) {
      if (event === 'end') {
        (callback as () => void)();
      }
      return this;
    });

    await expect(scaleVideo('input.mp4', 'output.mp4')).resolves.toEqual(
      'Successfully scaled input.mp4 to a height of 360 pixels.'
    );
  });

  it('rejects with an error message if the video processing fails', async () => {
    jest.spyOn(mockFfmpegCommand, 'on').mockImplementation(function (
      this: jest.Mocked<ffmpeg.FfmpegCommand>,
      event: unknown,
      callback: unknown
    ) {
      if (event === 'error') {
        (callback as (err: Error) => void)(
          new Error('Video processing failed.')
        );
      }
      return this;
    });

    await expect(scaleVideo('input.mp4', 'output.mp4')).rejects.toEqual(
      'An error occurred: Video processing failed.'
    );
  });
});
