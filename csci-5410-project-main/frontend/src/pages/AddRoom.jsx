import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const defaultPhotos = {
  "Standard Room":
    "https://dalvacationhomebucket.s3.amazonaws.com/standard_room.jpg",
  "Recreation Room":
    "https://dalvacationhomebucket.s3.amazonaws.com/recreation_room.jpg",
};

const AddRoom = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  const [type, setType] = useState("Standard Room");
  const [message, setMessage] = useState("");

  const handleAddRoom = (e) => {
    e.preventDefault();

    const room = {
      name,
      price,
      description,
      photo: defaultPhotos[type],
      amenities: amenities.split(",").map((amenity) => amenity.trim()),
      type,
    };

    fetch(process.env.REACT_APP_ADD_ROOMS_LAMBDA_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(data.error || "An unknown error occurred");
          });
        }
      })
      .then((data) => {
        setMessage("Room added successfully");
        setName("");
        setPrice("");
        setDescription("");
        setAmenities("");
        setType("Standard Room");
      })
      .catch((error) => setMessage(`Error: ${error.message}`));
  };

  return (
    <div className="container">
      <h2 className="my-4">Add New Room</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleAddRoom}>
        <div className="form-group">
          <label htmlFor="name">Room Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price per Night</label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amenities">Amenities (comma separated)</label>
          <input
            type="text"
            className="form-control"
            id="amenities"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Room Type</label>
          <select
            className="form-control"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="Standard Room">Standard Room</option>
            <option value="Recreation Room">Recreation Room</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
