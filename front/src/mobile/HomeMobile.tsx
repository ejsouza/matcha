import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Deck from 'components/Deck';
import NavBarMobile from './NavBarMobile';
import { updateUserCoordinates, UpdateUserInfoInterface } from 'api/user';

const HomeMobile = () => {
  const [errorGeo, setErrorGeo] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const userGeolocation: UpdateUserInfoInterface = {};
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const error = async () => {
      setErrorGeo(true);
      const userIp = await fetch('https://api.ipify.org?format=json')
        .then((res) => res.json())
        .then((data) => data.ip);

      const userGeo = fetch(`http://www.geoplugin.net/json.gp?ip=${userIp}`)
        .then((res) => res.json())
        .then((data) => data);

      userGeo.then((geo) => {
        userGeolocation.localisation = {
          x: geo.geoplugin_longitude,
          y: geo.geoplugin_latitude,
        };
        updateUserCoordinates(userGeolocation);
      });
    };

    const success = async (position: GeolocationPosition) => {
      const x = position.coords.longitude;
      const y = position.coords.latitude;

      userGeolocation.localisation = {
        x,
        y,
      };
      try {
        await updateUserCoordinates(userGeolocation);
      } catch (err) {
        console.log(`catch error on updating user coordinates := ${err}`);
      }
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  return (
    <>
      <Alert
        show={errorGeo}
        variant="danger"
        onClose={() => setErrorGeo(false)}
        dismissible
        className="geo-alert"
      >
        <Alert.Heading>You must allow browser geolocation!</Alert.Heading>
        <p>
          Unable to retrieve your location. Without your position you will no be
          able to match.
        </p>
      </Alert>
      <NavBarMobile />
      <Deck />
    </>
  );
};

export default HomeMobile;
