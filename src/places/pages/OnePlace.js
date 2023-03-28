import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceItem from "../components/PlaceItem";
import "./OnePlace.css";

const OnePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [currentUser, setCurrentUser] = useState();
  const [data, setData] = useState();
  const placeId = useParams().placeId;

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      setCurrentUser(userData.userId);
    }
  }, []);

  const placeDeletedHandler = (deletedPlaceId) => {
    setData((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setData(responseData.place);
      } catch (err) {}
    };
    fetchPlaces();
  }, [placeId, sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="place">
        {data && !isLoading ? (
          <PlaceItem
            key={data.id}
            id={data.id}
            image={data.image}
            title={data.title}
            description={data.description}
            address={data.address}
            creatorId={data.creator}
            coordinates={data.location}
            onDeletePlace={placeDeletedHandler}
            creatorName={data.creatorName ? data.creatorName : "unknown user"}
            creatorImage={data.creatorImage ? data.creatorImage : ""}
            likes={data.likes}
            comments={data.comments}
            currentUser={currentUser}
          />
        ) : (
          <p>Not found</p>
        )}
      </div>
    </React.Fragment>
  );
};

export default OnePlace;
