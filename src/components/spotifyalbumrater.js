import React from 'react';
import { withAuth0 } from "@auth0/auth0-react";

class SpotifyAlbumRater extends React.Component {
  /**
   * Represents an Album Rater object.
   * @constructor
   * @param {object} props - Props for the AlbumRater object (not used).
   */

  constructor(props) {
    super(props);

    // binds
    this.calculateSpotify = this.calculateSpotify.bind(this);
  }

  /**
   * Calculates the score.
   * @method
   */
  async calculateSpotify() {
    // calculates score based on number of seconds of each liked track over number of seconds of every track.
    const MGMT_TOKEN_URL = 'https://dev-06brcesa.us.auth0.com/api/v2/users/' ;
    const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search?';
    const SPOTIFY_ALBUM_URL = 'https://api.spotify.com/v1/albums/';
    const SPOTIFY_USER_URL = 'https://api.spotify.com/v1/me/tracks/contains?';
    const { user, getAccessTokenSilently } = this.props.auth0;

    document.getElementById('calculatedScoreSpotify').innerHTML = 'Loading rating...';

    // quick error check
    if (document.getElementById('album').value === "" || 
        document.getElementById('artist').value === "") {
      document.getElementById('calculatedScoreSpotify').innerHTML = 'Please fill in any missing data and try again.';
      return;
    }

    // getting access token
    const userToken = await getAccessTokenSilently();
    const mgmtUserInfo = await (await fetch(`${MGMT_TOKEN_URL}${user.sub}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })).json();

    // may need when debugging with postman
    console.log(mgmtUserInfo.accessToken);

    try {
      // getting album by doing a search with the artist / album values
      let searchParams = {
        q: `${document.getElementById('album').value} ${document.getElementById('artist').value}`,
        type: 'album',
        limit: 1
      };

      // getting search and album information from api
      const spotifySearchInfo = await (await fetch(`${SPOTIFY_SEARCH_URL}${new URLSearchParams(searchParams)}`, {
        headers: {
          Authorization: `Bearer ${mgmtUserInfo.accessToken}`
        }
      })).json();

      // quick catch to prevent error on next api call
      if (spotifySearchInfo.albums.items[0] === undefined) {
        document.getElementById('calculatedScoreSpotify').innerHTML = 'Album not found.'        
        return;
      }

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

      // presenting the math
      // nothing is displayed if calculated score is NaN (though it shouldn't be in any case, i don't think)
      if (isNaN(Math.round(likedTrackDurations / totalTrackDurations))) {
        document.getElementById('calculatedScoreSpotify').innerHTML = '';
      } else {
        document.getElementById('calculatedScoreSpotify').innerHTML = `Album rating: ${Math.round((likedTrackDurations / totalTrackDurations) * 10) / 2} out of 5`;
      }

    // catching if the Spotify API token needs refreshing
    } catch (e) {
      console.error(e);
      document.getElementById('calculatedScoreSpotify').innerHTML = 'Something bad happened. Please logout and log in to refresh the authentication.';
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
            <div style={{float: 'right'}}>
              <button  onClick={() => logout({returnTo: window.location.origin + window.location.pathname })}>Logout</button>
            </div>
            <br />
            <div style = {{float: 'left'}}>
              <label htmlFor="albumname">Album: </label>
              <input type="text" id="album" name="albumname"></input>
            </div>
            <br />
            <button onClick={this.calculateSpotify}>Calculate!</button>
            <h3 id='calculatedScoreSpotify'></h3>
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

export default withAuth0(SpotifyAlbumRater);