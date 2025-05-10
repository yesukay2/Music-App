import { togglePlayPause } from "../utils/player.js";
// const { togglePlayPause } = require("../utils/player");

describe("togglePlayPause", () => {
  let audio;

  beforeEach(() => {
    audio = {
      paused: true,
      play: jest.fn(() => {
        audio.paused = false;
      }),
      pause: jest.fn(() => {
        audio.paused = true;
      }),
    };
  });

  test("plays when paused", () => {
    const result = togglePlayPause(audio);
    expect(audio.play).toHaveBeenCalled();
    expect(result).toBe("playing");
  });

  test("pauses when playing", () => {
    audio.paused = false;
    const result = togglePlayPause(audio);
    expect(audio.pause).toHaveBeenCalled();
    expect(result).toBe("paused");
  });
});
