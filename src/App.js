import React, {useState,useEffect} from 'react'
import Dropdown from './components/Dropdown'
import Detail from './components/Detail'
import Listbox from './components/Listbox'
import { Credentials } from './Credentials'
import axios from 'axios'

const App = () => {
    const spotify = Credentials()

    const [token, setToken] = useState('')
    const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []})
    const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []})
    const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []})
    const [trackDetails, setTrackDetails] = useState(null)

    useEffect(() => {
        axios('https://accounts.spotify.com/api/token',{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic '+btoa(spotify.ClientID + ':' +spotify.ClientSecret),
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
        .then(tokenResponse => {
            setToken(tokenResponse.data.access_token)

            axios('https://api.spotify.com/v1/browse/categories?locale=pt_BR', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '+tokenResponse.data.access_token
                }
            }).then(genreResponse => {
                setGenres({
                    selectedGenre: genres.selectedGenre,
                    listOfGenresFromAPI: genreResponse.data.categories.items
                })
            })
        })
        .catch(error => {
            console.log("Token Error: "+error);
        }).then(() => {
            console.log(btoa(spotify.ClientID + ':' +spotify.ClientSecret))
        })}, [genres.selectedGenre, spotify.ClientID, spotify.ClientSecret])

    const genreChanged = val => {
        setGenres({
            selectedGenre: val,
            listOfGenresFromAPI: genres.listOfGenresFromAPI
        })

        axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
            method: 'GET',
            headers:{ 'Authorization': 'Bearer '+token }
        }).then(playlistResponse => {
            setPlaylist({
                selectedPlaylist: playlist.selectedPlaylist,
                listOfPlaylistFromAPI: playlistResponse.data.playlists.items
            })
        })
    }

    const playlistChanged = val => {
        setPlaylist({
            selectedPlaylist: val,
            listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
        })
    }

    const buttonClicked = e => {
        e.preventDefault()

        axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+token
            }
        })
        .then(tracksResponse => {
            setTracks({
                selectedTrack: tracks.selectedTrack,
                listOfTracksFromAPI: tracksResponse.data.items
            })
        })
    }

    const listboxClicked = val => {
        const currentTracks = [...tracks.listOfTracksFromAPI]
        const trackInfo = currentTracks.filter(t => t.track.id === val)

        setTrackDetails(trackInfo[0].track)
        console.log(trackInfo[0].track)
    }

    return(
        <div className="container p-5">
            <form onSubmit={buttonClicked}>
                <Dropdown label="G??nero :" options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged} />
                <Dropdown label="Playlist :" options={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} changed={playlistChanged} />

                <div className="col-sm-6 row form-group px-0">
                    <button type='submit' className="btn btn-success col-sm-12">
                    Buscar
                    </button>
                </div>

                <div className="row">
                    <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked} />
                    {trackDetails && <Detail {...trackDetails} />}
                </div>
            </form>
        </div>
    )
}

export default App;