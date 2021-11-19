import { useEffect, useState, useMemo } from 'react';
import { Col, Row, Modal, Form } from 'react-bootstrap';
import debounce from 'lodash.debounce';
import UpdateLink from './desktop/UpdateLink';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { UserInterface } from 'interfaces';
import Hr from './Hr';
import CenteredTextLink from './CenteredTextLink';
import ShowMap from './ShowMap';
import Passions from './Passions';
import Pictures from './Pictures';
import RangeSlider from './rangeSlider';
import DoubleRangeSlider from './rangeSlider/doubleRangeSlider';
import AgePreferenceSlider from './AgePreferenceSlider';
import DistancePreference from './DistancePreference';
import Loading from './Loading';
import { Gap } from 'globalStyled';
import { Button } from 'react-bootstrap';
import AccountSettingHeaderDesktop from 'components/desktop/AccountSettingHeaderDesktop';
import { LOGGED_USER, PASS_REGEX, CREATED, USER_TOKEN } from 'utils/const';
import { lookingFor } from 'utils/user';
import { user as userInitialState } from 'store';
import { isLoggedUpdated, userInfoUpdated } from 'store/actions';
import { updateUserInfo, UpdateUserInfoInterface } from 'api/user';
import socket, { SessionInterface } from 'socket/socket.io';
import { removeSessionFromLocalStorage } from 'utils/session';
import styled from 'styled-components';

const DiscoveryArea = styled.div`
  padding: 1vh 1vh;
  color: #868e96;
  p {
    font-size: 12px;
  }
`;

const SideBarScrollable = styled.div``;

interface RangeInterface {
  min: number;
  max: number;
}

const Settings = () => {
  const dispatch = useAppDispatch();
  const user: UserInterface = useAppSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(false);
  const [variant, setVariant] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<string | null>('');
  const [birthDate, setBirthDate] = useState<Date | string | null>('');
  const [newPassword, setNewPassword] = useState('');
  const [sexualOrientation, setSexualOrientation] =
    useState<string>('bisexual');
  const [description, setDescription] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const activateShowChangePassword = () => setShowChangePassword(true);

  useEffect(() => {
    if (user) {
      setUserName(user.username);
      setEmail(user.email);
      setFirstName(user.firstname);
      setLastName(user.lastname);
      setGender(user.gender);
      setBirthDate(user.birthdate);
      setDescription(user.biography);
      setSexualOrientation(user.sexual_orientation);
    }
  }, [user]);

  const logOut = () => {
    const username = user.username;
    localStorage.removeItem(LOGGED_USER);
    localStorage.removeItem(USER_TOKEN);
    dispatch(isLoggedUpdated(false));
    dispatch(userInfoUpdated(userInitialState));
    /**
     * Clean session storage
     */
    removeSessionFromLocalStorage();
    /**
     * Send event to remove session from api
     */
    socket.emit('logout', username);
    socket.emit('gonne offline', { username });
  };

  const handleUpdateProfileInfo = async () => {
    handleClose();
    let usr: UpdateUserInfoInterface = {};
    if (birthDate) {
      usr.birthdate = new Date(birthDate);
    }
    if (userName && userName !== user.username) {
      usr.username = userName;
    }
    if (lastName && lastName !== user.lastname) {
      usr.lastname = lastName;
    }
    if (email && email !== user.email) {
      usr.email = email;
    }
    if (gender) {
      usr.gender = gender;
    }
    if (sexualOrientation) {
      usr.sexual_orientation = sexualOrientation;
    }
    if (description) {
      usr.biography = description;
    }
    if (Object.keys(usr).length > 0) {
      try {
        const res = await updateUserInfo(usr);
        if (res?.status === CREATED) {
          const response = await res.json();
          const userData: UserInterface = response.user;

          dispatch(userInfoUpdated({ ...userData }));
          localStorage.setItem(LOGGED_USER, JSON.stringify(userData));
          setVariant('text-success-styled');
          setMessageText(`Updated succefully`);
          setMessage(true);
          setTimeout(() => {
            setVariant('');
            setMessageText('');
            setMessage(false);
          }, 2000);
        }
      } catch (err) {
        console.log(`catch := ${err}`);
      }
    }
  };

  const distancePreferenceHandler = (range: RangeInterface) => {
    console.log(`distancePreferenceHandler(${range.min} to ${range.max})`);
  };
  const debounceDistancePreferenceHandler = useMemo(
    () => debounce(distancePreferenceHandler, 300),
    []
  );

  const agePreferenceHandler = (range: RangeInterface) => {
    // console.log(`agePreferenceHandler(${range.min} to ${range.max})`);
  };
  const debounceAgePreferenceHandler = useMemo(
    () => debounce(agePreferenceHandler, 300),
    []
  );

  useEffect(() => {
    console.log(
      `ComponentDidMount(TARGET) [${user.age_preference_min}] [${user.age_preference_max}]`
    );
  }, []);
  return !user ? (
    <Loading />
  ) : (
    <>
      {/* Message success modal */}
      <Modal show={message}>
        <Modal.Body>
          <p className={variant}>{messageText}</p>
        </Modal.Body>
      </Modal>

      <SideBarScrollable>
        <AccountSettingHeaderDesktop cb={handleShow} />
        <Hr />
        <UpdateLink
          title="Email"
          value={user?.email}
          symbol=">"
          link="#"
          setEvent={handleShow}
        />
        <Hr />
        <UpdateLink
          title="Username"
          value={user?.username}
          symbol=">"
          link="#"
          setEvent={handleShow}
        />
        <Hr />
        <UpdateLink
          title="First name"
          value={user?.firstname}
          symbol=">"
          link="#"
          setEvent={handleShow}
        />
        <Hr />
        <UpdateLink
          title="Last name"
          value={user?.lastname}
          symbol=">"
          link="#"
          setEvent={handleShow}
        />
        <Hr />
        <UpdateLink
          title="Password"
          symbol=">"
          link="#"
          setEvent={activateShowChangePassword}
        />
        <Hr />
        <UpdateLink
          title="description"
          value={user?.biography}
          symbol=">"
          link="#"
          setEvent={handleShow}
        />
        <Hr />
        <DiscoveryArea>
          <p>Verified email help secure your account.</p>
          <Row>
            <Col md={4}>DISCOVERY&nbsp;&nbsp;SETTINGS</Col>
          </Row>
        </DiscoveryArea>
        <Hr />
        <ShowMap />
        <Hr />
        {/* <RangeSlider
          min={1}
          max={user.distance_preference}
          maxRange={1000}
          doubleRange={false}
          title="Distance preference"
          onChange={({ min, max }: { min: number; max: number }) =>
            debounceDistancePreferenceHandler({ min, max })
          }
        /> */}
        <DistancePreference />
        <Hr />
        <UpdateLink
          title="Looking for"
          value={lookingFor(user)}
          symbol=">"
          link="#"
          setEvent={handleShow}
        />
        <Hr />
        <AgePreferenceSlider />
        <Hr />

        <Passions />
        <Hr />
        <Pictures />
        <Hr />
        <Gap top="8px">&nbsp;</Gap>
        <Hr />
        <CenteredTextLink text="Logout" onClick={() => logOut()} />
        <Hr />
      </SideBarScrollable>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        scrollable
        dialogClassName="gray-one"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Update Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                className="gray-one"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="User name"
                value={userName}
                className="gray-one"
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First name"
                value={firstName}
                className="gray-one"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last name"
                value={lastName}
                className="gray-one"
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="birthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                placeholder="Last name"
                className="gray-one"
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                inline
                value="female"
                type="radio"
                label="Female"
                name="formRadios"
                id="radioFemale"
                onChange={(e) => setGender(e.target.value)}
                checked={gender === 'female'}
              />
              <Form.Check
                inline
                value="male"
                type="radio"
                label="Male"
                name="formRadios"
                id="radioMale"
                onChange={(e) => setGender(e.target.value)}
                checked={gender === 'male'}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="sexualOrientation">
              <Form.Label>Orientation</Form.Label>
              <Form.Control
                as="select"
                className="gray-one"
                onChange={(e) => setSexualOrientation(e.target.value)}
                defaultValue={sexualOrientation}
              >
                <option value="straight">Straight</option>
                <option value="bisexual">Bisexual</option>
                <option value="gay">Gay</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                type="text"
                placeholder="Description"
                value={description || ''}
                className="gray-one"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="w-100 theme-background-on-hover"
            variant="outline-secondary"
            onClick={handleUpdateProfileInfo}
          >
            Update Profile
          </Button>
        </Modal.Footer>
      </Modal>
      {/**************** Change Password Modal ****************/}
      <Modal
        show={showChangePassword}
        size="sm"
        backdrop="static"
        keyboard={false}
        onHide={() => setShowChangePassword(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h6">Change password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Change Password</Form.Label>
            <Form.Control
              onChange={(e) => setNewPassword(e.target.value)}
              isInvalid={!PASS_REGEX.test(newPassword)}
              isValid={PASS_REGEX.test(newPassword)}
              type="password"
              placeholder="Password"
            />
            <Form.Text className="text-muted">
              Password should be at least 6 characters long composed with
              letters, numbers and symbols.
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="w-100 theme-background-on-hover"
            variant="outline-secondary"
            onClick={() => {
              setNewPassword('');
              setShowChangePassword(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/**************** End Change Password Modal ****************/}
    </>
  );
};

export default Settings;
