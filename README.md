# Music Video Player

This is a React application that allows users to load and play YouTube music videos by entering a video URL. It analyzes the song's title to retrieve song and artist information, fetches trivia about the song, and provides the lyrics. Users can control the video playback and see detailed information about the video.

## Features

- Load and play YouTube videos by entering the video URL.
- Analyze the song title and retrieve the song name and artist.
- Fetch trivia about the song and display it.
- Display the lyrics of the song.
- Video controls for play/pause, volume control, mute toggle, and seeking.
- Expandable video description.

## Technologies

- React
- TypeScript
- Tailwind CSS
- YouTube API (for video details)
- Lyrics API (for song lyrics)
- Grok AI (for song analysis and trivia)

## Setup

### 1. Clone the repository

Clone this repository to your local machine using:

 bash
` 
git clone https://github.com/your-username/music-video-player.git
cd music-video-player 
`

### 2\. Install dependencies

Make sure you have [Node.js](https://nodejs.org/) installed. Then, run the following command to install the necessary dependencies:

bash

Copiar código

`npm install`

### 3\. Set up environment variables

Create a `.env` file in the root of the project and add the following variables:

env

Copiar código

`VITE_GROK_API_KEY=your-grok-api-key`

Replace `your-grok-api-key` with your actual Grok API key.

### 4\. Run the app

After setting up the environment variables, start the development server:

bash

Copiar código

`npm run dev`

Open your browser and go to `http://localhost:3000` to view the application.

 

Contributing
------------

We welcome contributions to improve this project. To contribute:

1.  Fork the repository.
2.  Create a new branch for your changes.
3.  Make your changes and commit them.
4.  Open a pull request to merge your changes into the `main` branch.

License
-------

This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
----------------

-   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
-   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
-   YouTube API - Provides information about YouTube videos.
-   [Lyrics.ovh API](https://lyrics.ovh/) - API to fetch song lyrics.
-   [Grok AI](https://www.x.ai/) - AI service for song analysis and trivia.

