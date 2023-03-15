import React from "react";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDeletePlace={props.onDeletePlace}
          creatorName={place.creatorName ? place.creatorName : "unknown user"}
          creatorImage={place.creatorImage ? place.creatorImage : ""}
          likes={place.likes}
          comments={place.comments}
          currentUser={props.currentUser}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
