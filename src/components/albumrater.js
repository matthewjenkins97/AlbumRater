import React from 'react';
import { withAuth0 } from "@auth0/auth0-react";

class AlbumRater extends React.Component {
  /**
   * Represents an Album Rater object.
   * @constructor
   * @param {object} props - Props for the AlbumRater object (not used).
   */

  constructor(props) {
    super(props);

    // binds
    this.calculate = this.calculate.bind(this);
  }

  /**
   * Calculates the score.
   * @method
   */
  async calculate() {
    // calculates score based on number of seconds of each liked track over number of seconds of every track.
    // let liked = 0;
    // let total = 0;
    const MGMT_TOKEN_URL = 'https://dev-06brcesa.us.auth0.com/api/v2/users/' ;
    const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search?';
    const SPOTIFY_USER_URL = 'https://api.spotify.com/v1/me/tracks/?';
    const { user, getAccessTokenSilently } = this.props.auth0;

    document.getElementById('calculatedScore').innerHTML = 'Loading rating...';

    // get user information via auth0
    
    const userToken = await getAccessTokenSilently();
    const mgmtUserInfo = await (await fetch(`${MGMT_TOKEN_URL}${user.sub}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })).json();

    // may need when debugging with postman
    //console.log(mgmtUserInfo.accessToken);

    // getting album by doing a search with the artist / album values
    const searchParams = {
      q: `${document.getElementById('album').value} ${document.getElementById('artist').value}`,
      type: 'album',
      limit: 1
    }
    const spotifySearchInfo = await (await fetch(`${SPOTIFY_SEARCH_URL}${new URLSearchParams(searchParams)}`, {
      headers: {
        Authorization: `Bearer ${mgmtUserInfo.accessToken}`
      }
    })).json();
    const album = spotifySearchInfo.albums.items[0];
    
    // fetch user's likes and do a quick filter based on whether the likes are in the album mentioned
    // sleep a half second, then do a call on the user's liked tracks list
    // add object to spotifyUserLikes if spotifyUserInfo.items isn't empty
    let offsetVal = 0;
    let spotifyUserLikes = []
    let spotifyUserInfo = {};
    do {
      // fetch tracks in batches of 50 tracks
      const userParams = {
        limit: 50,
        offset: offsetVal * 50
      };
      spotifyUserInfo = await (await fetch(`${SPOTIFY_USER_URL}${new URLSearchParams(userParams)}`, {
        headers: {
          Authorization: `Bearer ${mgmtUserInfo.accessToken}`
        }
      })).json();

      // add only if there are items in the items member of the object
      if (spotifyUserInfo.items.length !== 0) {
        spotifyUserLikes[offsetVal] = spotifyUserInfo;
      }

      // incrementing
      offsetVal++;
      // console.log(spotifyUserLikes);

    } while (spotifyUserInfo.items.length !== 0);

    // getting liked track lengths and adding them to a variable
    let likedTrackDurations = 0;
    for (let page of spotifyUserLikes) {
      for (let item of page.items) {
        if (item.track.album.name === album.name) {
          likedTrackDurations = likedTrackDurations += item.track.duration_ms;
      }
    }

    // getting all album tracks
    const spotifyTrackInfo = await (await fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
      headers: {
        Authorization: `Bearer ${mgmtUserInfo.accessToken}`
      }
    })).json();

    //calculating total album length
    let totalTrackDurations = 0;
    for (let item of spotifyTrackInfo.items) {
      totalTrackDurations = totalTrackDurations += item.duration_ms;
    }

    // // presenting the math
    // // nothing is displayed if calculated score is NaN
    if (isNaN(Math.round(likedTrackDurations / totalTrackDurations))) {
      document.getElementById('calculatedScore').innerHTML = '';
    } else {
      document.getElementById('calculatedScore').innerHTML = `Album rating: ${Math.round((likedTrackDurations / totalTrackDurations) * 10) / 2} out of 5`;
    }
  }
}

  /**
   * Renders object.
   * @method
   * @return {JSX}
  */
  render() {
    const { isAuthenticated, logout, loginWithRedirect } = this.props.auth0;
    return (
      <div>
        { isAuthenticated ?
          <div>
            <div style = {{float: 'left'}}>
              <label htmlFor="artistname">Artist: </label>
              <input type="text" id="artist" name="artistname"></input>
            </div>
            <button style={{float: 'right'}} onClick={() => logout({returnTo: window.location.origin + window.location.pathname })}>Logout</button>
            <br />
            <div style = {{float: 'left'}}>
              <label htmlFor="albumname">Album: </label>
              <input type="text" id="album" name="albumname"></input>
            </div>
            <br />
            <button onClick={this.calculate}>Calculate!</button>
            <h3 id='calculatedScore'></h3>
          </div>
          : 
          <div>
            <button onClick={() => loginWithRedirect()}>Login</button>
          </div>
          }
      </div>
    );
  };
}

export default withAuth0(AlbumRater);