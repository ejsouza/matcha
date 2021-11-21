import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Settings from 'components/Settings';
import Notifications from 'components/Notifications';
import Deck from 'components/Deck';
import Chat from 'components/chat/Chat';
import { updateUserCoordinates, UpdateUserInfoInterface } from 'api/user';
import ProfileHeaderDesktop from 'components/desktop/ProfileHeaderDesktop';

const SideBar = styled(Col)`
  background-color: #f2f5f9;
  height: 125vh;
  margin: 0;
  padding: 0;
`;

const MainContent = styled(Col)`
  overflow-x: hidden !important;
  background-color: #f2f5f9;
  height: 125vh;
  border-left: 1px solid #e0e5ec;
`;

const HomeDesktop = () => {
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

  const handleShowSettings = () => {
    setShowNotification(false);
    setShowSettings(true);
  };

  const handleshowNotification = () => {
    setShowSettings(false);
    setShowNotification(true);
  };

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
      <Container fluid>
        <Row>
          <SideBar sm={12} md={3}>
            <ProfileHeaderDesktop
              cbSettings={handleShowSettings}
              cbNotification={handleshowNotification}
            />
            {showSettings && <Settings margintop="75px" />}
            {showNotification && (
              <Notifications
                notif={showNotification}
                topTitle="75px"
                wrapperpaddingtop="100px"
              />
            )}
          </SideBar>
          <MainContent sm={12} md={9}>
            <Deck />
            <Chat top="0" position="fixed" marginRight="10px" />
          </MainContent>
        </Row>
      </Container>
    </>
  );
};

export default HomeDesktop;
