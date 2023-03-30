import React from 'react';
import './App.css';
import AlbumRater from './components/albumrater';
import SpotifyAlbumRater from './components/spotifyalbumrater';

function App() {
  return (
    <div>
      <h1>Album Rater</h1>
      <hr />
      <div class="grid-container">
        <div class="grid-child">
          <div class="grid-element">
            <h2>Traditional</h2>
            <p>For each track on the album, type in its length in minutes and seconds, and whether you liked it or not. Your score will be automatically generated below the list.</p>
            <AlbumRater></AlbumRater>
          </div>
        </div>
        <div class="grid-child">
          <div class="grid-element">
            <h2>Spotify</h2>
            <SpotifyAlbumRater></SpotifyAlbumRater>
          </div>
        </div>
      </div>
      <hr />
      <p>Made by <a href="http://matthewjenkins97.github.io">Matthew R. Jenkins</a> in 2023. Application uses <a href="https://reactjs.org/">React</a> and CSS from <a href="http://bettermotherfuckingwebsite.com/">bettermotherfuckingwebsite.com</a>.</p>
    </div>
  );
}

export default App;
