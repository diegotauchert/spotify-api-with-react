import React from 'react'

const Detail = ({album, artists, name}) => {
  return (
      <div className="offset-md-1 col-sm-4" >
          <div className="row col-sm-12 px-0">
            <img 
              src={album.images[0].url}
              alt={name}
              width={400} />
          </div>
          <div className="row col-sm-12 px-0">
            <label htmlFor={name}>
              <small className="text-center d-block text-uppercase text-xs"><em>{album.album_type}</em></small>
              {name}
            </label>
          </div>
          <div className="row col-sm-12 px-0">
            <label htmlFor={artists[0].name}>{artists[0].name}</label>
          </div>
      </div>
  )
}

export default Detail