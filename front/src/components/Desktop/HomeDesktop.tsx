import { render } from 'react-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Settings from 'components/Settings';
import Likes from 'components/Likes';
import Deck from 'components/Deck';
import { updateUserCoordinates, UpdateUserInfoInterface } from 'api/user';
import defaultProfilePicture from 'assets/icons/profile-picture-default.svg';
import briefcase from 'assets/icons/brief_case.svg';

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

const ProfileHeader = styled(Row)`
  height: 74px;
  background-color: red; /* For browsers that do not support gradients */
  background-image: linear-gradient(to right, #fd297b, #ff655b);
  -webkit-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 1px 4px rgba(0, 0, 0.5, 0.5);
  position: -webkit-sticky;
  top: -1px;
  z-index: 3;
`;

const BoxHeader = styled(Col)`
  display: flex;
  color: #fff;
  align-items: flex-start;
  height: 72px;
  align-content: space-between;
  padding: 16px;
`;
const BoxHeaderItem = styled(Col)`
  align-self: center;
  cursor: pointer;
`;

const BoxProfileHeaderItem = styled(Col)`
  align-self: center;
`;

const HomeDesktop = () => {
  const [errorGeo, setErrorGeo] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [showLikes, setShowLikes] = useState(false);

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
        // updateUserInfo(userGeolocation);
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
    setShowLikes(false);
    setShowSettings(true);
  };

  const handleShowLikes = () => {
    setShowSettings(false);
    setShowLikes(true);
  };

  return (
    <>
      <Alert
        show={errorGeo}
        variant="danger"
        onClose={() => setErrorGeo(false)}
        dismissible
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
            <ProfileHeader>
              <BoxHeader>
                <BoxHeaderItem md={2}>
                  <img
                    alt="profile"
                    src={defaultProfilePicture}
                    height="24px"
                    width="24px"
                    onClick={handleShowSettings}
                  />
                </BoxHeaderItem>
                <BoxProfileHeaderItem md={9}>My Profile</BoxProfileHeaderItem>
                <BoxHeaderItem md={1}>
                  <img
                    alt="briefcase"
                    src={briefcase}
                    height="24px"
                    width="24px"
                    onClick={handleShowLikes}
                  />
                </BoxHeaderItem>
              </BoxHeader>
            </ProfileHeader>
            {showSettings && <Settings />}
            {showLikes && <Likes />}
          </SideBar>
          <MainContent sm={12} md={9}>
            <Deck />
          </MainContent>
        </Row>
      </Container>
    </>
  );
};

export default HomeDesktop;
