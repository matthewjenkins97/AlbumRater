import React from 'react';
import './App.css';
import AlbumRater from './components/albumrater';

function App() {
  return (
    <div>
      <h1>Album Rater</h1>
      <hr />
      <AlbumRater></AlbumRater>
      <hr />
      <p>Made by <a href="http://matthewjenkins97.github.io">Matthew R. Jenkins</a> in 2021. Application uses <a href="https://reactjs.org/">React</a> and CSS from <a href="http://bettermotherfuckingwebsite.com/">bettermotherfuckingwebsite.com</a>.</p>
      <p>Note that this is still in development! If you encounter any bugs feel free to report them on my <a href="https://github.com/matthewjenkins97/SpotifyAlbumRater/issues">github page</a>.</p>
    </div>
  );
}

export default App;
