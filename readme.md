# yt-custom-player

> A library for styling and customizing the YouTube player in React.

## Installation

To install the library, use npm or yarn:

```bash
npm install yt-custom-player
```

or

```bash
yarn add yt-custom-player
```

## Usage

Implement and use the `YouTubeEmbed` component in your React project.

### Basic example

```jsx
import React from 'react';
import YouTubeEmbed from 'yt-custom-player';

const App = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
      <YouTubeEmbed videoId="dQw4w9WgXcQ" start={43} end={101} />
    </div>
  );
};

export default App;
```


## Properties

These are the properties supported by the library.

| Property           | Type    | Description                                                   | Default |
|--------------------|---------|---------------------------------------------------------------|---------|
| videoId            | string  | The YouTube video ID to be displayed.                         | null    |
| start              | number  | The start time in seconds to begin video playback.            | 0       |
| end                | number  | The end time in seconds to stop video playback.               | 0       |
| autoplay           | bool    | Whether the video should start automatically.                  | false   |
| muted              | bool    | Whether the video should play without sound.                   | false   |
| repeat             | bool    | Whether the video should repeat automatically after ending.    | false   |
| showInicialOverlay | bool    | Whether the initial overlay should be displayed.              | true    |
| showPlayPauseBtn   | bool    | Whether the play/pause button should be displayed.            | true    |
| showMuteBtn        | bool    | Whether the mute/unmute button should be displayed.           | true    |
| showProgressBar    | bool    | Whether the video progress bar should be displayed.           | true    |
| aspectRatio        | string  | Defines the aspect ratio of the player (e.g., '16:9', '4:3'). | '16:9'  |
| fullScreen         | bool    | Whether the fullscreen mode should be enabled.                | true    |


## Contribution

If you'd like to contribute to the library, feel free to fork it and submit pull requests. Be sure to follow good coding practices and include tests whenever possible.

1. **Fork this repository.**
   
   - Go to the repository page on GitHub and click the "Fork" button in the top right corner.

2. **Create a branch for your feature.**
   
   - Open the terminal and navigate to the repository directory.
   - Run the command to create a new branch:
     ```bash
     git checkout -b feature/new-feature
     ```

3. **Commit your changes.**
   
   - After making the desired changes to the code, add the changes to the staging area:
     ```bash
     git add .
     ```
   - Commit your changes:
     ```bash
     git commit -am 'Add new feature'
     ```

4. **Push to the remote repository.**
   
   - Push your branch to the remote repository:
     ```bash
     git push origin feature/new-feature
     ```

5. **Open a pull request.**
   
   - Go to the repository on GitHub, and you will see a button to open a pull request (PR) for your branch.
   - Click on "Compare & pull request" and add a detailed description of your changes.

## License

This project is licensed under the MIT License - see the LICENSE file available in the repository for more details.
