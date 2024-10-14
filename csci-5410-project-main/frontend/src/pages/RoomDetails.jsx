import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReserveRoom from "./ReserveRoom";
import "bootstrap/dist/css/bootstrap.min.css";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [reviewError, setReviewError] = useState("");
  const [userId] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email
      : ""
  );

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
        console.log("Fetched room data:", responseData);

        const data = JSON.parse(responseData.body);
        if (data.error) {
          setError(data.error);
        } else {
          setRoom(data);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchRoomReviews = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_GET_REVIEWS_LAMBDA_API_ENDPOINT.replace(
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
        console.log("Fetched reviews data:", responseData);

        const data = JSON.parse(responseData.body);
        if (data.error) {
          setReviewError(data.error);
        } else {
          setReviews(data);
        }
      } catch (err) {
        setReviewError(err.message);
      }
    };

    fetchRoomDetails();
    fetchRoomReviews();
  }, [id]);

  const handleAddReview = async () => {
    if (!userId) {
      setReviewError("User not logged in.");
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_ADD_REVIEWS_LAMBDA_API_ENDPOINT.replace(
          "{id}",
          id
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, review: newReview, rating: newRating }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Add review response:", responseData);

      if (responseData.error) {
        setReviewError(responseData.error);
      } else {
        setReviews([...reviews, { review: newReview, rating: newRating }]);
        setNewReview("");
        setNewRating(0);
      }
    } catch (err) {
      setReviewError(err.message);
    }
  };

  const handleStarClick = (rating) => {
    setNewRating(rating);
  };

  const renderStars = () => {
    return [...Array(5).keys()].map((index) => (
      <span
        key={index}
        onClick={() => handleStarClick(index + 1)}
        style={{
          cursor: "pointer",
          color: index < newRating ? "gold" : "gray",
          fontSize: "24px",
        }}
      >
        ★
      </span>
    ));
  };

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-4">
          <img src={room.photo} alt={room.name} className="img-fluid" />
        </div>
        <div className="col-md-8">
          <h2>{room.name}</h2>
          <p>{room.description}</p>
          <p>Price: ${room.price}</p>
          <p>Amenities: {room.amenities ? room.amenities.join(", ") : "N/A"}</p>
          <ReserveRoom roomId={room.roomId} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h3>Reviews</h3>
          {reviewError && (
            <div className="alert alert-danger">{reviewError}</div>
          )}
          {reviews.length > 0 ? (
            <ul className="list-group">
              {reviews.map((review, index) => (
                <li key={index} className="list-group-item">
                  <div>
                    {"★".repeat(review.rating)} {"☆".repeat(5 - review.rating)}{" "}
                    - {review.review}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}

          {!userId ? (
            <div className="alert alert-warning mt-4">
              You must be logged in to add a review.
            </div>
          ) : (
            <div className="mt-4">
              <h4>Add a Review</h4>
              {renderStars()}
              <textarea
                className="form-control mt-2"
                rows="4"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAddReview}
                disabled={!newReview || newRating === 0}
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
