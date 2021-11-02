import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { userInfoUpdated } from 'store/actions';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import UpdateLink from './desktop/UpdateLink';
import { UserInterface } from 'interfaces';
import {
  getUser,
  updateUserCoordinates,
  UpdateUserInfoInterface,
} from 'api/user';
import { SUCCESS, CREATED } from 'utils/const';

interface LatLngInterface {
  _latlng: { lat: number; lng: number };
}
const ShowMap = () => {
  const dispatch = useAppDispatch();
  const user: UserInterface = useAppSelector((state) => state.user);
  const markerRef = useRef(null);
  const [draggable, setDraggable] = useState(false);
  const [show, setShow] = useState(false);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0,
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const pos: LatLngInterface = marker;
          if (pos._latlng.lat !== 0 && pos._latlng.lng !== 0) {
            setPosition(pos._latlng);
            const usr: UpdateUserInfoInterface = {};
            usr.localisation = {
              x: pos._latlng.lng,
              y: pos._latlng.lat,
            };
            updateUserCoordinates(usr).then((res) => {
              if (res?.status === CREATED) {
                getUser().then((res) => {
                  if (res?.status === SUCCESS) {
                    res.json().then((userUpdated: UserInterface) => {
                      console.log(`HERE COMES THE PRBLEM ${userUpdated}`);
                      dispatch(userInfoUpdated({ ...userUpdated }));
                    });
                  }
                });
              }
            });
          }
        }
      },
    }),
    [dispatch]
  );

  useEffect(() => {
    const getUserGeolocation = async () => {
      const userGeolocation = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${user?.localisation?.y}&longitude=${user?.localisation?.x}&localityLanguage=en`,
        {
          mode: 'cors',
        }
      );

      const userGeoData = await userGeolocation.json();
      setCity(userGeoData.locality);
      setCountry(userGeoData.countryName);
    };
    if (user) {
      getUserGeolocation();
      setPosition({
        lat: user?.localisation?.y,
        lng: user?.localisation?.x,
      });
    }
  }, [user]);
  const handleShowMap = () => setShow(true);

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);
  return (
    <>
      <UpdateLink
        title="Location"
        value={`${city}, ${country}`}
        symbol=">"
        link="#"
        setEvent={handleShowMap}
      />
      {/**************** Start Map Modal ****************/}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="update-link">Current location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={position}
              draggable={draggable}
              eventHandlers={eventHandlers}
              ref={markerRef}
            >
              <Popup minWidth={90}>
                <span onClick={toggleDraggable}>
                  {draggable
                    ? 'Marker is draggable'
                    : 'Click here to make marker draggable'}
                </span>
              </Popup>
            </Marker>
          </MapContainer>
        </Modal.Body>
      </Modal>
      {/**************** End Map Modal ****************/}
    </>
  );
};

export default ShowMap;
