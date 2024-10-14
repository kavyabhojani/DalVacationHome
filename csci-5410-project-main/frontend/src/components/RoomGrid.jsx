import React, { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import "bootstrap/dist/css/bootstrap.min.css";

const RoomGrid = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_GET_ROOMS_LAMBDA_API_ENDPOINT,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        console.log("Fetched response data:", responseData);
        if (responseData.body && typeof responseData.body === "string") {
          const data = JSON.parse(responseData.body);
          console.log("Parsed data:", data);

          if (Array.isArray(data)) {
            setRooms(
              data.map((room) => ({
                id: room.roomId,
                photo: room.photo,
                amenities: room.amenities.map((amenity) => amenity.S),
                price: room.price,
                name: room.name,
                type: room.type,
              }))
            );
          } else {
            throw new Error("Parsed data is not an array");
          }
        } else {
          throw new Error("Response body is missing or not a string");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(error.message);
      }
    };

    fetchRooms();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(rooms)) {
    return <div>Unexpected data format</div>;
  }

  return (
    <div className="container">
      <div className="row">
        {rooms.length > 0 ? (
          rooms.map((room) => <RoomCard key={room.id} room={room} />)
        ) : (
          <div>No rooms available</div>
        )}
      </div>
    </div>
  );
};

export default RoomGrid;
