import React from 'react';

export default class AlbumRater extends React.Component {
  constructor(props) {
    super(props);

    // setting initial variables
    this.trackNumber = 0;
    this.trackInformation = [];
    
    // binds
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.calculate = this.calculate.bind(this);
  }

  calculate() {
    // calculates score based on number of seconds of each liked track over number of seconds of every track.
    let liked = 0;
    let total = 0;

    // getting seconds of every liked track, and seconds of every track
    for (let value of this.trackInformation) {
      if (value[1]) {
        liked += value[0];
      }
      total += value[0];
    }

    // doing math
    // nothing is displayed if calculated score is NaN
    if (isNaN(Math.round(liked / total))) {
      document.getElementById("calculatedScore").innerHTML = "";
    } else {
      document.getElementById("calculatedScore").innerHTML = `Album rating: ${Math.round((liked / total) * 10) / 2} out of 5`;
    }
  }

  addTrack() {
    // variables for adding
    const minutes = document.getElementById("trackMinutes").value;
    const seconds = document.getElementById("trackSeconds").value;
    const approval = document.getElementById("trackApproval").checked;

    // edge guarding
    if (minutes < 0 || seconds < 0) {
      alert("Minutes or seconds cannot be negative numbers.")
      return;
    }
    if (seconds >= 60) {
      alert("Number of seconds cannot be greater than 60.")
      return;
    }

    // increment track number (used for html IDs)
    this.trackNumber += 1;

    // creating node
    let node = document.createElement("li");
    node.id = "track" + this.trackNumber;
    node.innerHTML = `${minutes.padStart(1, "0")}:${seconds.padStart(2, "0")} - ${approval}`

    // adding to track information in order to calculate
    this.trackInformation.push([(parseInt(minutes) * 60) + parseInt(seconds), approval])
    document.getElementById("trackList").append(node);

    // resetting buttons
    document.getElementById("trackMinutes").value = "";
    document.getElementById("trackSeconds").value = "";
    document.getElementById("trackApproval").checked = false;

    // refreshing widgets
    this.calculate();
    this.forceUpdate();
  }

  removeTrack() {
    // if track number > 0 you can remove and pop things, otherwise do nothing
    if (this.trackNumber > 0) {
      let nodeID = "track" + this.trackNumber;
      document.getElementById(nodeID).remove();
      this.trackInformation.pop();
    }

    // set track number to 0
    this.trackNumber = this.trackNumber > 0 ? this.trackNumber - 1: 0;

    this.calculate();
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <ol id="trackList">
        </ol>
        <div>
          <label>Minutes: </label>
          <input id="trackMinutes" type="number"></input>
        </div>
        <div>
          <label>Seconds: </label>
          <input id="trackSeconds" type="number"></input>
        </div>
        <div>
          <label>Good Track? </label>
          <input id="trackApproval" type="checkbox"></input>
        </div>
        <button onClick={this.addTrack}>+</button>
        <button onClick={this.removeTrack}>-</button>
        <h3 id="calculatedScore"> </h3>
      </div>
    )
  };
}