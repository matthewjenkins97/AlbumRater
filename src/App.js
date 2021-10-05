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
      <p>Made by <a href="http://matthewjenkins97.github.io">Matthew R. Jenkins</a> in 2019. Application uses <a href="https://reactjs.org/">React</a> and CSS from <a href="http://bettermotherfuckingwebsite.com/">bettermotherfuckingwebsite.com</a>.</p>
    </div>
  );
}

export default App;
