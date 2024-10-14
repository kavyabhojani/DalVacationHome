import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EditRoom = () => {
  const { id } = useParams();
  const [room, setRoom] = useState({
    name: "",
    price: "",
    description: "",
    photo: "",
    amenities: "",
    type: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_GET_ROOM_LAMBDA_API_ENDPOINT.replace(
            "{id}",
            id
          ),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        const data = JSON.parse(responseData.body);
        setRoom(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handleChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_EDIT_ROOMS_LAMBDA_API_ENDPOINT.replace(
          "{id}",
          id
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(room),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h2>Edit Room</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Room Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={room.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={room.price}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={room.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">
            Photo URL
          </label>
          <input
            type="text"
            className="form-control"
            id="photo"
            name="photo"
            value={room.photo}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amenities" className="form-label">
            Amenities
          </label>
          <input
            type="text"
            className="form-control"
            id="amenities"
            name="amenities"
            value={room.amenities}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Type
          </label>
          <select
            className="form-select"
            id="type"
            name="type"
            value={room.type}
            onChange={handleChange}
          >
            <option value="Standard Room">Standard Room</option>
            <option value="Recreation Room">Recreation Room</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Update Room
        </button>
      </form>
    </div>
  );
};

export default EditRoom;
