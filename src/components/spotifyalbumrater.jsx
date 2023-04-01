import React from 'react';
import { withAuth0 } from "@auth0/auth0-react";
import './spotifyalbumrater.css';

class SpotifyAlbumRater extends React.Component {
  /**
   * Represents an Album Rater object.
   * @constructor
   * @param {object} props - Props for the AlbumRater object (not used).
   */

  constructor(props) {
    super(props);
    this.albums = [];
    this.accessToken = '';

    // binds
    this.fetchAlbums = this.fetchAlbums.bind(this);
    this.calculateSpotify = this.calculateSpotify.bind(this);
  }

  /**
   * Fetches album information.
   * @method
   */
  async fetchAlbums() {
    // calculates score based on number of seconds of each liked track over number of seconds of every track.
    const MGMT_TOKEN_URL = 'https://dev-06brcesa.us.auth0.com/api/v2/users/' ;
    const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search?';
    const SPOTIFY_ALBUM_URL = 'https://api.spotify.com/v1/albums/';
    const { user, getAccessTokenSilently } = this.props.auth0;

    document.getElementById("searchButton").disabled = true;

    // quick error check
    if (document.getElementById('search').value === "" ) {
      alert('Please fill in any missing data and try again.');
      document.getElementById("searchButton").disabled = false;
      return;
    }

    document.getElementById('flavorText').innerHTML = 'Searching...';

    // getting access token
    const userToken = await getAccessTokenSilently();
    const mgmtUserInfo = await (await fetch(`${MGMT_TOKEN_URL}${user.sub}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })).json();
    this.accessToken = mgmtUserInfo.accessToken;

    // may need when debugging with postman
    //console.log(mgmtUserInfo.accessToken);

    try {
      // getting album by doing a search with the artist / album values
      let searchParams = {
        q: `${document.getElementById('search').value}`,
        type: 'album',
        limit: 5
      };

      // getting search and album information from api
      const spotifySearchInfo = await (await fetch(`${SPOTIFY_SEARCH_URL}${new URLSearchParams(searchParams)}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })).json();

      // quick catch to prevent error on next api call
      if (spotifySearchInfo.albums.items[0] === undefined) {
        alert('Album not found.');
        document.getElementById("searchButton").disabled = false;
        document.getElementById('flavorText').innerHTML = '';
        return;
      }

      // fetch 3 topmost albums 
      this.albums = [];
      for (let albumName of spotifySearchInfo.albums.items) {
        const spotifyAlbumInfo = await (await fetch(`${SPOTIFY_ALBUM_URL}${albumName.id}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })).json();
        this.albums.push(spotifyAlbumInfo);
      }
      document.getElementById('flavorText').innerHTML = 'Click one of the albums below to rate it.';
      this.forceUpdate();

      // catching if the Spotify API token needs refreshing
    } catch (e) {
      console.error(e);
      alert('Something bad happened. Please logout and log in to refresh the authentication.');
    }

    document.getElementById("searchButton").disabled = false;
  }

  /**
   * Calculates the score.
   * @method
   */
  async calculateSpotify(event) {
    const SPOTIFY_USER_URL = 'https://api.spotify.com/v1/me/tracks/contains?';

    const albumId = event.target.id;
    let albumFinal = {};

    for (let album of this.albums) {
      if (album.id == albumId) {
        albumFinal = this.albums[this.albums.indexOf(album)]
        break;
      }
    }

    // //getting tracks on the album that are liked by the user
    const trackIds = [];

    for (let track of albumFinal.tracks.items) {
      trackIds.push(track.id);
    }
    let searchParams = { ids: trackIds };

    try {
      const spotifyLikedTrackInfo = await (await fetch(`${SPOTIFY_USER_URL}${new URLSearchParams(searchParams)}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })).json();

      //calculating liked track length and total album length
      let likedTrackDurations = 0;
      let totalTrackDurations = 0;
      const albumInfo = albumFinal.tracks.items;
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

    } catch (e) {
      console.error(e);
      alert('Something bad happened. Please logout and log in to refresh the authentication.');
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
            <div className='float-left'>
              <input type="text" id="search" name="searchparam"></input>
            </div>
            <div className='float-right'>
              <button  onClick={() => logout({returnTo: window.location.origin + window.location.pathname })}>Logout</button>
            </div>
            <br />
            <button id="searchButton" onClick={this.fetchAlbums}>Search Spotify!</button>
            <p id='flavorText'></p>
            <div id='images'>
              {
                this.albums.map((item) => (
                <img className='album-image' src={item.images[0].url}
                  onClick={this.calculateSpotify}
                  id={item.id}
                  key={this.albums.indexOf(item)} ></img>
                ))
              }
            </div>
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