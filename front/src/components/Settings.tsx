import { useEffect, useState } from 'react';
import { Col, Row, Modal, Form } from 'react-bootstrap';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import UpdateLink from './Desktop/UpdateLink';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { UserInterface } from 'interfaces';
import Hr from './Hr';
import CenteredTextLink from './CenteredTextLink';
import ShowMap from './ShowMap';
import Passions from './Passions';
import Pictures from './Pictures';
import RangeSlider from './rangeSlider';
import { Gap } from 'globalStyled';
import { Button } from 'react-bootstrap';
import { LOGGED_USER, PASS_REGEX, SUCCESS } from 'utils/const';
import { lookingFor } from 'utils/user';
import { user as userInitialState } from 'store';
import { isLoggedUpdated, userInfoUpdated } from 'store/actions';
import { getUser, updateUserInfo, UpdateUserInfoInterface } from 'api/user';
import styled from 'styled-components';

const DiscoveryArea = styled.div`
  padding: 1vh 1vh;
  color: #868e96;
  p {
    font-size: 12px;
  }
`;

const SideBarScrollable = styled.div``;

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
    setUserName(user.username);
    setEmail(user.email);
    setFirstName(user.firstname);
    setLastName(user.lastname);
    setGender(user.gender);
    setBirthDate(user.birthdate);
    setDescription(user.description);
    setSexualOrientation(user.sexual_orientation);
  }, [user]);

  const logOut = () => {
    localStorage.removeItem(LOGGED_USER);
    dispatch(isLoggedUpdated(false));
    dispatch(userInfoUpdated(userInitialState));
  };

  const handleUpdateProfileInfo = async () => {
    handleClose();
    let usr: UpdateUserInfoInterface = {};
    if (birthDate) {
      usr.birthdate = new Date(birthDate);
      console.log(`birthdate := ${birthDate} -- ${usr.birthdate}`);
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
      usr.description = description;
    }
    if (Object.keys(usr).length > 0) {
      try {
        const res = await updateUserInfo(usr);
        const data = await res?.json();
        Object.entries(data).forEach((d) => console.log(d));
        if (res?.status === SUCCESS) {
          const response = await getUser(user.token);
          const userData: UserInterface = await response.json();
          console.log(`userData := ${userData}`);
          if (response.status === SUCCESS) {
            dispatch(userInfoUpdated({ ...userData }));
            localStorage.setItem(LOGGED_USER, JSON.stringify(userData));
            setVariant('text-success-styled');
            setMessageText(data.message);
            setMessage(true);
            setTimeout(() => {
              setVariant('');
              setMessageText('');
              setMessage(false);
            }, 2000);
          }
        }
      } catch (err) {
        console.log(`catch := ${err}`);
      }
    }
  };
  console.log(user);

  const sliderCallBack = (min: number, max: number) => {
    console.log(`changing range from ${min} to ${max}`);
  };
  return (
    <>
      {/* Message success modal */}
      <Modal show={message}>
        <Modal.Body>
          <p className={variant}>{messageText}</p>
        </Modal.Body>
      </Modal>

      <SideBarScrollable>
        <Row className="account-setting" onClick={() => setShow(true)}>
          <Col md={4}>ACCOUNT&nbsp;&nbsp;SETTINGS</Col>
          <Col className="text-end">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#E0E5EC"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="settings">
                <path
                  id="settingCircle"
                  d="M12.7531 24H11.2469C10.0286 24 9.03745 23.0089 9.03745 21.7906V21.2811C8.51953 21.1156 8.01633 20.9067 7.53291 20.6565L7.17178 21.0177C6.29714 21.8934 4.89609 21.8677 4.04686 21.0173L2.98228 19.9528C2.13155 19.103 2.10708 17.7024 2.98256 16.8279L3.34341 16.467C3.09323 15.9836 2.88441 15.4805 2.71889 14.9625H2.20936C0.991172 14.9625 0 13.9714 0 12.7531V11.2469C0 10.0286 0.991172 9.0375 2.20941 9.0375H2.71894C2.88445 8.51953 3.09328 8.01638 3.34345 7.53295L2.98233 7.17188C2.10736 6.29784 2.1315 4.89712 2.98261 4.04695L4.04728 2.98233C4.89848 2.12995 6.2992 2.10867 7.17216 2.98261L7.53295 3.34341C8.01638 3.09328 8.51958 2.88441 9.0375 2.71889V2.20936C9.0375 0.991125 10.0286 0 11.2469 0H12.7531C13.9714 0 14.9625 0.991125 14.9625 2.20936V2.71894C15.4804 2.88441 15.9836 3.09328 16.467 3.34345L16.8282 2.98233C17.7028 2.10661 19.1039 2.1323 19.9531 2.98266L21.0177 4.04719C21.8684 4.89698 21.8929 6.29756 21.0174 7.17211L20.6565 7.53295C20.9067 8.01638 21.1155 8.51948 21.2811 9.0375H21.7906C23.0088 9.0375 24 10.0286 24 11.2469V12.7531C24 13.9714 23.0088 14.9625 21.7906 14.9625H21.2811C21.1155 15.4805 20.9067 15.9836 20.6565 16.467L21.0177 16.8282C21.8926 17.7022 21.8685 19.1029 21.0174 19.9531L19.9527 21.0177C19.1015 21.8701 17.7008 21.8914 16.8278 21.0174L16.467 20.6566C15.9836 20.9068 15.4804 21.1156 14.9625 21.2812V21.7907C14.9625 23.0089 13.9714 24 12.7531 24V24ZM7.76798 19.1798C8.43956 19.577 9.16238 19.8771 9.91631 20.0716C10.2268 20.1518 10.4438 20.4318 10.4438 20.7525V21.7906C10.4438 22.2335 10.8041 22.5938 11.2469 22.5938H12.7531C13.196 22.5938 13.5563 22.2335 13.5563 21.7906V20.7525C13.5563 20.4318 13.7732 20.1518 14.0837 20.0716C14.8377 19.8771 15.5605 19.577 16.2321 19.1798C16.5084 19.0164 16.8602 19.0609 17.0872 19.2879L17.8226 20.0233C18.1396 20.3408 18.6488 20.3334 18.9581 20.0236L20.0234 18.9584C20.3319 18.6502 20.3422 18.141 20.0237 17.8228L19.288 17.0871C19.061 16.8601 19.0166 16.5083 19.1799 16.232C19.5771 15.5605 19.8771 14.8377 20.0717 14.0837C20.1518 13.7732 20.4319 13.5563 20.7525 13.5563H21.7906C22.2335 13.5563 22.5938 13.196 22.5938 12.7532V11.2469C22.5938 10.8041 22.2335 10.4438 21.7906 10.4438H20.7525C20.4318 10.4438 20.1518 10.2269 20.0717 9.91641C19.8771 9.16242 19.5771 8.43961 19.1799 7.76808C19.0166 7.4918 19.061 7.13995 19.288 6.91298L20.0234 6.17756C20.3413 5.86003 20.333 5.35097 20.0237 5.04202L18.9585 3.97678C18.6497 3.66759 18.1404 3.65855 17.8229 3.9765L17.0873 4.7122C16.8603 4.93922 16.5083 4.98366 16.2321 4.82025C15.5605 4.42308 14.8377 4.12303 14.0838 3.92845C13.7733 3.84834 13.5563 3.56831 13.5563 3.24764V2.20936C13.5563 1.76653 13.196 1.40625 12.7532 1.40625H11.247C10.8041 1.40625 10.4438 1.76653 10.4438 2.20936V3.24755C10.4438 3.56822 10.2269 3.84825 9.91636 3.92836C9.16242 4.12294 8.43961 4.42298 7.76803 4.82016C7.49166 4.98352 7.13986 4.93908 6.91289 4.71211L6.17752 3.97669C5.86045 3.65925 5.35125 3.66661 5.04202 3.97636L3.97669 5.04164C3.66816 5.3498 3.65784 5.859 3.97641 6.17719L4.71211 6.91289C4.93908 7.13986 4.98352 7.4917 4.82016 7.76798C4.42298 8.43952 4.12298 9.16233 3.92841 9.91631C3.84825 10.2268 3.56822 10.4437 3.24759 10.4437H2.20941C1.76658 10.4437 1.40625 10.804 1.40625 11.2469V12.7531C1.40625 13.196 1.76658 13.5563 2.20941 13.5563H3.24755C3.56822 13.5563 3.8482 13.7732 3.92836 14.0836C4.12294 14.8376 4.42298 15.5604 4.82011 16.232C4.98347 16.5083 4.93903 16.8601 4.71206 17.0871L3.97664 17.8225C3.65873 18.14 3.66703 18.6491 3.97636 18.958L5.04159 20.0233C5.35036 20.3325 5.85961 20.3415 6.17714 20.0235L6.9128 19.2878C7.08005 19.1206 7.428 18.9788 7.76798 19.1798V19.1798Z"
                />
                <path
                  id="settingCross"
                  d="M12 17.2219C9.12061 17.2219 6.77812 14.8793 6.77812 12C6.77812 9.12065 9.12061 6.77812 12 6.77812C14.8794 6.77812 17.2219 9.12065 17.2219 12C17.2219 14.8793 14.8794 17.2219 12 17.2219V17.2219ZM12 8.18437C9.89601 8.18437 8.18437 9.89606 8.18437 12C8.18437 14.1039 9.89606 15.8156 12 15.8156C14.1039 15.8156 15.8156 14.1039 15.8156 12C15.8156 9.89606 14.104 8.18437 12 8.18437V8.18437Z"
                />
              </g>
            </svg>
          </Col>
        </Row>
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
          value={user?.description}
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
        <RangeSlider
          min={0}
          max={100}
          doubleRange={false}
          title="Distance preference"
          onChange={({ min, max }: { min: number; max: number }) =>
            console.log(`min = ${min}, max = ${max}`)
          }
        />
        <Hr />
        <UpdateLink
          title="Looking for"
          value={lookingFor(user)}
          symbol=">"
          link="#"
          setEvent={handleShow}
        />
        <Hr />
        <RangeSlider
          min={18}
          max={100}
          doubleRange={true}
          title="Age preference"
          onChange={({ min, max }: { min: number; max: number }) =>
            console.log(`min = ${min}, max = ${max}`)
          }
        />
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
        size="sm"
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
