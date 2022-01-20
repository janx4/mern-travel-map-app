import { useEffect, useState, Fragment } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@mui/icons-material";
import axios from "axios";
import { format } from "timeago.js";

import "./App.css";

function App() {
    const currentUser = "john";
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [rating, setRating] = useState("");

    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 21.030653,
        longitude: 105.84713,
        zoom: 8,
    });

    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get("/pins");
                setPins(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getPins();
    }, []);

    const markerClickHandler = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({ ...viewport, latitude: lat, longitude: long });
    };

    const addPlaceHandler = (e) => {
        const [long, lat] = e.lngLat;
        setNewPlace({
            lat,
            long,
        });
    };

    const formSubmissionHandler = (e) => {
        e.preventDefault();
        console.log('submitted')
    }

    return (
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
            mapStyle="mapbox://styles/conghuy/ckyll9mi775gi15pwjf1fdv7r"
            onDblClick={addPlaceHandler}
        >
            {pins.map((pin) => (
                <Fragment key={pin._id}>
                    <Marker
                        latitude={pin.lat}
                        longitude={pin.long}
                        offsetLeft={-20}
                        offsetTop={-10}
                    >
                        <Room
                            style={{
                                fontSize: viewport.zoom * 7,
                                color:
                                    pin.username === currentUser
                                        ? "red"
                                        : "slateblue",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                markerClickHandler(pin._id, pin.lat, pin.long);
                            }}
                        />
                    </Marker>
                    {pin._id === currentPlaceId && (
                        <Popup
                            latitude={pin.lat}
                            longitude={pin.long}
                            closeButton={true}
                            closeOnClick={false}
                            anchor="right"
                            onClose={() => setCurrentPlaceId(null)}
                        >
                            <div className="card">
                                <label>Place</label>
                                <h4 className="place">{pin.title}</h4>
                                <label>Review</label>
                                <p className="description">{pin.description}</p>
                                <label>Rating</label>
                                <div className="stars">
                                    <Star className="star" />
                                    <Star className="star" />
                                    <Star className="star" />
                                    <Star className="star" />
                                    <Star className="star" />
                                </div>
                                <label>Infomation</label>
                                <span className="username">
                                    Created by <b>{pin.username}</b>
                                </span>
                                <span className="date">
                                    {format(pin.createdAt)}
                                </span>
                            </div>
                        </Popup>
                    )}

                    {newPlace && (
                        <Popup
                            latitude={newPlace.lat}
                            longitude={newPlace.long}
                            closeButton={true}
                            closeOnClick={false}
                            anchor="right"
                            onClose={() => setNewPlace(null)}
                        >
                            <div>
                                <form onSubmit={formSubmissionHandler} className="card">
                                    <label>Title :</label>
                                    <input
                                        onChange={(e) => setTitle(e.target.value)}
                                        type="text"
                                        placeholder="Enter a title for this place"
                                    />

                                    <label>Review :</label>
                                    <textarea
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder="Type something about this place"
                                    ></textarea>

                                    <label>Rating :</label>
                                    <select
                                        onChange={(e) => setRating(e.target.value)}
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                    <button className="submitButton">
                                        Add place
                                    </button>
                                </form>
                            </div>
                        </Popup>
                    )}
                </Fragment>
            ))}
        </ReactMapGL>
    );
}

export default App;
