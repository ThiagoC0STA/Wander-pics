import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";

const Places = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [dataPlaces, setDataPlaces] = useState();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      setCurrentUser(userData.userId);
    }
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places`
        );

        setDataPlaces(responseData.places.reverse());
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setDataPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && dataPlaces && (
        <PlaceList
          items={dataPlaces}
          currentUser={currentUser}
          onDeletePlace={placeDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Places;
