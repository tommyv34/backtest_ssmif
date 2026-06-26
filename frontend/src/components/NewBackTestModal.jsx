// import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

// import queries from "../queries.js";
import { useEffect } from "react";
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px',
    backgroundColor: 'black'
  }
};

function NewBackTestModal(props){
    const [addAlbum] = useMutation(queries.ADD_ALBUM, {
    refetchQueries: [{ query: queries.GET_ALBUMS }]
    });

    const handleAddAlbum = async (e) => {
        e.preventDefault();
        let title = document.getElementById('title');
        let genre = document.getElementById('genre');
        let track_count = document.getElementById('track_count');
        let artist = document.getElementById('artist');
        let release_date = document.getElementById('release_date');
        let promo_start = document.getElementById('promo_start');
        let promo_end = document.getElementById('promo_end');
        try{
            await addAlbum({
                variables: {
                    title: title.value,
                    genre: genre.value,
                    track_count: parseInt(track_count.value),
                    artist: artist.value,
                    release_date: release_date.value,
                    promo_start: promo_start.value,
                    promo_end: promo_end.value
                }
            });
            document.getElementById('add-album').reset();
            alert('Album Added');
            props.closeAddFormState();
        }
        catch(e){
            alert(`Error adding album: ${e.message}`);
        }
  };
    const { loading, error, data } = useQuery(queries.GET_ARTISTS);
    const navigate = useNavigate();

    useEffect(()=>{
        if(!loading && (!data || !data.artists || data.artists.length == 0)){
            alert("Unable to add album while there are no exisiting artists");
            props.closeAddFormState();
            navigate("/albums");
        }
    },[data, loading])

    return(
        <ReactModal
        name='editAlbumModal'
        isOpen={props.isOpen}
        contentLabel='Edit Album'
        style={customStyles}>
        <div>
            <h2>Add New Album</h2>
            <form id='add-album' onSubmit={handleAddAlbum}>
            <div>
                <label>
                Title:
                <br />
                <input id='title' required autoFocus={true} />
                </label>
            </div>
            <br />
            <div>
                <label>
                Genre:
                <br />
                <input id='genre' required />
                </label>
            </div>
            <br />
            <div>
                <label>
                Track Count:
                <br />
                <input id='track_count' required />
                </label>
            </div>
            <br />
            <div>
                <label>
                Artist:
                <br />
                <select id="artist" required>
                    {data?.artists?.map((artist => (
                        <option key={artist._id} value={artist._id}>
                            {artist.stage_name}
                        </option>
                    )))}
                </select>
                </label>
            </div>
            <br />
            <div>
                <label>
                Release Date:
                <br />
                <input id='release_date' required placeholder="MM/DD/YYYY" />
                </label>
            </div>
            <br />
            <div>
                <label>
                Promo Start:
                <br />
                <input id='promo_start' required placeholder="MM/DD/YYYY"/>
                </label>
            </div>
            <br />
            <div>
                <label>
                Promo End:
                <br />
                <input id='promo_end' required placeholder="MM/DD/YYYY"/>
                </label>
            </div>
            <br />            
            <button type='submit'>
                Add Album
            </button>
            </form>
            <button onClick={props.closeAddFormState}>
                Close
            </button>
        </div>
        </ReactModal>
    )
}

export default NewBackTestModal;