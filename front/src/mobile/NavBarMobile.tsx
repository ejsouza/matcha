import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import Chat from 'components/chat/Chat';
import Button from 'components/Button';
import Settings from 'components/Settings';
import Notifications from 'components/Notifications';
import styled from 'styled-components';
import profileSVG from 'assets/icons/profile-picture-pink.svg';
import briefcaseSVG from 'assets/icons/briefcase-pink.svg';

const ButtonWrapper = styled.div`
  position: relative;
  top: 0;
`;

const FlexContainer = styled.div`
  margin-top: -10px;
  padding: 0 1em 0.3em 1em;
  background: black;
  display: flex;
`;

const FlexContainerIcons = styled.div`
  display: flex;
`;

const FloatRight = styled.div`
  margin-left: auto;
`;

const FloatIconLeft = styled.div``;

const FloatIconRight = styled.div`
  margin-left: 6.5em;
`;

const NavBarMobile = () => {
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = () => setShowOffCanvas(true);
  const handleShowSettings = () => {
    setShowNotifications(false);
    setShowSettings(true);
  };

  const handleShowNotifications = () => {
    setShowSettings(false);
    setShowNotifications(true);
  };

  const callBack = () => {
    handleShowOffCanvas();
  };
  return (
    <>
      <FlexContainer>
        <ButtonWrapper>
          <Button text="Menu" wid="100px" callBack={callBack} />
        </ButtonWrapper>
        <FloatRight>
          <Chat top="0" position="relative" marginRight="0" />
        </FloatRight>
      </FlexContainer>
      <Offcanvas show={showOffCanvas} onHide={handleCloseOffCanvas}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FlexContainerIcons>
              <FloatIconLeft onClick={handleShowSettings}>
                <img
                  src={profileSVG}
                  alt="profile-svg"
                  width={36}
                  height={36}
                />
              </FloatIconLeft>

              <FloatIconRight onClick={handleShowNotifications}>
                <img
                  src={briefcaseSVG}
                  alt="profile-svg"
                  width={36}
                  height={36}
                />
              </FloatIconRight>
            </FlexContainerIcons>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {showSettings && <Settings margintop="0" />}
          {showNotifications && (
            <Notifications
              notif={showNotifications}
              topTitle="20px"
              wrapperpaddingtop="30px"
            />
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NavBarMobile;
