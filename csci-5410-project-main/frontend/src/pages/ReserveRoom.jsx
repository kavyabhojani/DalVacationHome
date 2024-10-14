import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ReserveRoom = ({ roomId }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [userId] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email
      : ""
  );
  const [error, setError] = useState("");

  const handleReserve = async () => {
    if (!userId) {
      setError("User not logged in.");
      return;
    }
    if (endDate <= startDate) {
      setError("End date must be after start date.");
      return;
    }

    const payload = {
      user_id: userId,
      room_id: roomId,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_RESERVE_ROOMS_LAMBDA_API_ENDPOINT.replace(
          "{id}",
          roomId
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Reserve room response:", responseData);

      if (responseData.error) {
        setError(responseData.error);
      } else {
        alert("Room reserved successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reserve the room.");
    }
  };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-md-4 mb-3">
          <label className="form-label">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            minDate={new Date()}
            dateFormat="yyyy/MM/dd"
            className="form-control"
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={startDate}
            dateFormat="yyyy/MM/dd"
            className="form-control"
          />
        </div>
        <div className="col-md-4 mb-3 d-flex align-items-end">
          <button onClick={handleReserve} className="btn btn-primary w-100">
            Reserve
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReserveRoom;
