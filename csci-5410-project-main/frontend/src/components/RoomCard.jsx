import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const RoomCard = ({ room }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.email === "jadejajayraj2002@gmail.com";

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src={room.photo} className="card-img-top" alt={room.name} />
        <div className="card-body">
          <h5 className="card-title">{room.name}</h5>
          <p className="card-text">Type: {room.type}</p>
          <p className="card-text">${room.price} per night</p>
          <Link to={`/rooms/${room.id}`} className="btn btn-primary">
            View Details
          </Link>
          {isAdmin && (
            <Link
              to={`/edit-room/${room.id}`}
              className="btn btn-secondary ms-2"
            >
              Edit Room
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
