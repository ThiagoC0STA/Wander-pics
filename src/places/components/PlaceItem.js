import React, { useState, useContext, useEffect } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  AiOutlineShareAlt,
  AiOutlineHeart,
  AiOutlineComment,
  AiFillHeart,
} from "react-icons/ai";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [likesCount, setLikesCount] = useState(0);
  const [like, setLike] = useState();

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  useEffect(() => {
    if (props.likes.length > 0) {
      // eslint-disable-next-line array-callback-return
      props.likes.map((like) => {
        if (like === props.currentUser) {
          setLike(true);
          setLikesCount(props.likes.length);
        } else {
          setLike(false);
          setLikesCount(props.likes.length);
        }
      });
    } else {
      setLike(false);
      setLikesCount(props.likes.length);
    }
  }, [props.currentUser, props.likes]);

  const handleLike = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/places/likes/${props.id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${auth.token}` },
          body: {},
        }
      );
      const updatedData = await response.json();
      console.log(updatedData);
      setLike(updatedData.isLiked);
      setLikesCount(updatedData.likesNumber);
    } catch (err) {
      console.log(err);
    }
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      props.onDeletePlace(props.id);
    } catch (e) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container" style={{ padding: "5px" }}>
          <iframe
            title="map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={
              "https://maps.google.com/maps?q=" +
              props.coordinates.lat.toString() +
              "," +
              props.coordinates.lng.toString() +
              "&t=&z=15&ie=UTF8&iwloc=&output=embed"
            }
          ></iframe>
          <script
            type="text/javascript"
            src="https://embedmaps.com/google-maps-authorization/script.js?id=5a33be79e53caf0a07dfec499abf84b7b481f165"
          ></script>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="creator_post">
            <div>
              <img src={props.creatorImage} alt="user" />
              <p>{props.creatorName}</p>
            </div>
            <AiOutlineShareAlt />
          </div>
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="like__comment">
            <div>
              <figure>
                <figcaption>{likesCount}</figcaption>
                {like ? (
                  <AiFillHeart onClick={handleLike} />
                ) : (
                  <AiOutlineHeart onClick={handleLike} />
                )}
              </figure>
              <AiOutlineComment />
            </div>
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
