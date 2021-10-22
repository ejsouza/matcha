import { useState } from 'react';
import { Modal, Button, Carousel, Badge } from 'react-bootstrap';
import { UpdateUserInfoInterface } from 'api/user';
import { getUserCity, aHundredLengthBio, calculateAge } from 'utils/user';
import { FlexBox } from 'globalStyled';
import { Wrapper } from './LikeButton';
import styled from 'styled-components';
import info from 'assets/icons/info.svg';
import location from 'assets/icons/location.svg';
import sexualOrientation from 'assets/icons/sexualOrientation.svg';
import gender from 'assets/icons/gender.svg';
import agePlus18 from 'assets/icons/age-plus-18.svg';
import userNameIcon from 'assets/icons/usernameicon.svg';
import userDescription from 'assets/icons/user-description.svg';
import tagIcon from 'assets/icons/tag-icon.svg';

const CarouselWrapper = styled.div`
  width: 340px;
  height: 500px;
`;

const ProfileWrapper = styled.div`
  max-width: 680px;
  margin: auto;
`;

const ProfileInfo = styled.div`
  width: 340px;
  height: 500px;
  padding: 0 8px;
  color: #868e96;
  border: 1px solid red;
  span {
    letter-spacing: 0.1em;
  }
`;

const InfoButton = (props: { user: UpdateUserInfoInterface }) => {
  const [profile, setProfile] = useState<UpdateUserInfoInterface>();
  const [show, setShow] = useState(false);
  const [userCity, setUserCity] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleClose = () => {
    setShow(false);
    setProfile(undefined);
  };
  const handleShow = () => setShow(true);

  const hanldeUserInfo = () => {
    if (props?.user?.id) {
      setProfile(props.user);
      if (typeof props.user.birthdate === 'string') {
        setBirthDate(props.user.birthdate);
      }
      const city = getUserCity({
        longitude: props.user.localisation?.x,
        latitude: props.user.localisation?.y,
      });
      city.then((info) => {
        setUserCity(info);
        handleShow();
      });
    }
  };
  return (
    <>
      {profile && (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size="lg"
          style={{ backgroundColor: '#252932' }}
        >
          <Modal.Header closeButton>
            <Modal.Title className="gray-one">
              {profile.firstname}'s profile
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProfileWrapper>
              <FlexBox flexWrap="wrap">
                <CarouselWrapper>
                  <Carousel>
                    <Carousel.Item>
                      {profile?.pictures?.map((picture) => (
                        <div key={picture.id}>
                          <img
                            className="d-block w-100"
                            src={
                              picture.path?.startsWith('https')
                                ? picture.path
                                : `${process.env.REACT_APP_API_URL}/uploads/${picture.path}`
                            }
                            alt="First slide"
                            width="300"
                            height="500"
                          />
                          <Carousel.Caption></Carousel.Caption>
                        </div>
                      ))}
                    </Carousel.Item>
                  </Carousel>
                </CarouselWrapper>
                <ProfileInfo>
                  <p>
                    <img src={userNameIcon} alt="username" />
                    &nbsp;{profile.firstname}&nbsp;
                    {profile.lastname}
                  </p>
                  <p>
                    <img src={agePlus18} alt="age" />
                    &nbsp;{calculateAge(birthDate)} years old
                  </p>
                  <p>
                    <img src={gender} alt="gender" />
                    &nbsp;{profile.gender}
                  </p>
                  <p>
                    <img src={sexualOrientation} alt="sexualOrientation" />
                    &nbsp;
                    {profile.sexual_orientation}
                  </p>
                  <p>
                    <img src={location} alt="location" />
                    &nbsp;{userCity || ''}
                  </p>
                  <p>
                    <img src={userDescription} alt="userDescription" />
                    &nbsp;
                    {aHundredLengthBio(profile.biography)}
                  </p>
                  <p>
                    <img src={tagIcon} alt="tagIcon" width="28" height="18" />
                    {profile.tags?.map((tag) => (
                      <span key={tag.id}> #{tag.name}</span>
                    ))}
                  </p>
                </ProfileInfo>
              </FlexBox>
            </ProfileWrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary">Understood</Button>
          </Modal.Footer>
        </Modal>
      )}
      <Wrapper onClick={hanldeUserInfo}>
        <img src={info} alt="info-icon" width="24" height="36" />
      </Wrapper>
    </>
  );
};

export default InfoButton;
