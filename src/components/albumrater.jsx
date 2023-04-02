import React from 'react';
import "./albumrater.css";

export default class AlbumRater extends React.Component {
  /**
   * Represents an Album Rater object. Creates an initial state with 0 tracks.
   * @constructor
   * @param {object} props - Props for the AlbumRater object (not used).
   */
  constructor(props) {
    super(props);

    // setting initial variables
    this.trackNumber = 0;

    // binds
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.calculateTrad = this.calculateTrad.bind(this);
  }

  /**
   * Calculates the score.
   * @method
   */
  calculateTrad() {
    // calculates score based on number of seconds of each liked track over number of seconds of every track.
    let liked = 0;
    let total = 0;

    // calculating by every track provided in the <ol>
    for (let i = 1; i < this.trackNumber + 1; i++) {
      const minutes = parseInt(document.getElementById('trackMinutes' + i).value);
      const seconds = parseInt(document.getElementById('trackSeconds' + i).value);
      const approval = document.getElementById('trackApproval' + i).checked;

      // edge guarding
      // anything blank?
      if (isNaN(minutes) || isNaN(seconds)) {
        alert('Please fill any missing data.');
        return;
      }
      // anything not positive?
      if (minutes < 0 || seconds < 0) {
        alert('Minutes or seconds cannot be negative numbers.');
        return;
      }
      // seconds greater than 60?
      if (seconds >= 60) {
        alert('Number of seconds cannot be greater than 60.');
        return;
      }

      // calculation
      if (approval) {
        liked += parseInt(minutes) * 60;
        liked += parseInt(seconds);
      }
      total += parseInt(minutes) * 60;
      total += parseInt(seconds);
    }

    // presenting the math
    // nothing is displayed if calculated score is NaN
    if (isNaN(Math.round(liked / total))) {
      document.getElementById('calculatedScoreTrad').innerHTML = '';
    } else {
      document.getElementById('calculatedScoreTrad').innerHTML = `Album rating: ${Math.round((liked / total) * 10) / 2} out of 5`;
    }
  }

  /**
   * Adds a track to the ordered list.
   * @method
   */
  addTrack() {
    this.trackNumber += 1;

    // creating node
    const node = document.createElement('li');
    node.id = 'track' + this.trackNumber;
    node.innerHTML = `
      <input id=trackMinutes${this.trackNumber} type=number min="0"></input>
      <span>:</span>
      <input id=trackSeconds${this.trackNumber} type=number min="0"></input>
      <input id=trackApproval${this.trackNumber} type=checkbox></input>
    `;

    // adding to track information in order to calculate
    document.getElementById('trackList').append(node);

    // refreshing widgets
    this.forceUpdate();
  }

  /**
   * Removes the last track from the ordered list.
   * @method
   */
  removeTrack() {
    // if track number > 0 you can remove and pop things, otherwise do nothing
    if (this.trackNumber > 0) {
      const nodeID = 'track' + this.trackNumber;
      document.getElementById(nodeID).remove();
    }

    // set track number to 0
    this.trackNumber = this.trackNumber > 0 ? this.trackNumber - 1: 0;

    this.forceUpdate();
  }

  /**
   * Renders object.
   * @method
   * @return {JSX}
  */
  render() {
    return (
      <div>
        <ol id="trackList">
        </ol>
        <button onClick={this.addTrack}>+</button>
        <button onClick={this.removeTrack}>-</button>
        <br />
        <button onClick={this.calculateTrad}>Calculate!</button>
        <h3 id='calculatedScoreTrad'></h3>
      </div>
    );
  };
}
