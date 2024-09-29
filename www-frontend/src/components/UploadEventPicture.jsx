import React, { useState } from 'react';
import axios from 'axios';

function UploadEventPicture({ eventId }) {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('event_picture[image]', image); 

    try {
      const response = await axios.post(`/api/v1/events/${eventId}/add_picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error al subir la imagen');
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} required />
        <button 
            type="submit" 
            style={{
            backgroundColor: 'blue', 
            color: 'white'
        }}
        >
        Subir Imagen
        </button>
        </form>
        {message && <p>{message}</p>}
    </div>
  );
}

export default UploadEventPicture;
