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
    const SPOTIFY_ALBUM_URL = 'https://api.spotify.com/v1/albums/';
    const SPOTIFY_USER_URL = 'https://api.spotify.com/v1/me/tracks/contains?';
    const { user, getAccessTokenSilently } = this.props.auth0;

    document.getElementById('calculatedScore').innerHTML = 'Loading rating...';

    const userToken = await getAccessTokenSilently();
    const mgmtUserInfo = await (await fetch(`${MGMT_TOKEN_URL}${user.sub}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })).json();

    // may need when debugging with postman
    //console.log(mgmtUserInfo.accessToken);

    // getting album by doing a search with the artist / album values
    let searchParams = {
      q: `${document.getElementById('album').value} ${document.getElementById('artist').value}`,
      type: 'album',
      limit: 1
    };
    const spotifySearchInfo = await (await fetch(`${SPOTIFY_SEARCH_URL}${new URLSearchParams(searchParams)}`, {
      headers: {
        Authorization: `Bearer ${mgmtUserInfo.accessToken}`
      }
    })).json();
    const albumName = spotifySearchInfo.albums.items[0].id;
    const spotifyAlbumInfo = await (await fetch(`${SPOTIFY_ALBUM_URL}${albumName}`, {
      headers: {
        Authorization: `Bearer ${mgmtUserInfo.accessToken}`
      }
    })).json();

    // getting tracks on the album that are liked by the user
    const trackIds = [];
    for (let track of spotifyAlbumInfo.tracks.items) {
      trackIds.push(track.id);
    }
    searchParams = { ids: trackIds };
    const spotifyLikedTrackInfo = await (await fetch(`${SPOTIFY_USER_URL}${new URLSearchParams(searchParams)}`, {
      headers: {
        Authorization: `Bearer ${mgmtUserInfo.accessToken}`
      }
    })).json();

    //calculating liked track length and total album length
    let likedTrackDurations = 0;
    let totalTrackDurations = 0;
    const albumInfo = spotifyAlbumInfo.tracks.items;
    for (let i = 0; i < albumInfo.length; i++) {
      if (spotifyLikedTrackInfo[i]) {
        likedTrackDurations = likedTrackDurations += albumInfo[i].duration_ms;
      }
      totalTrackDurations = totalTrackDurations + albumInfo[i].duration_ms;
    }

    // // presenting the math
    // // nothing is displayed if calculated score is NaN
    if (isNaN(Math.round(likedTrackDurations / totalTrackDurations))) {
      document.getElementById('calculatedScore').innerHTML = '';
    } else {
      document.getElementById('calculatedScore').innerHTML = `Album rating: ${Math.round((likedTrackDurations / totalTrackDurations) * 10) / 2} out of 5`;
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