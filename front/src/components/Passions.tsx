import { useState } from 'react';
import { Row, Col, Modal, Container, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { userInfoUpdated } from 'store/actions';
import { LinkTo, LinkWrapper } from './Desktop/UpdateLink';
import { UserInterface } from 'interfaces';
import {
  getUser,
  updateUserCoordinates,
  updateUserInfo,
  UpdateUserInfoInterface,
} from 'api/user';
import { getTags, getAllAvailableTags, removeTag, addTag } from 'api/tag';
import { SUCCESS } from 'utils/const';
import styled from 'styled-components';

interface Tags {
  id: number;
  user_id: number;
  name: string;
}

const TagWrapper = styled.div`
  display: inline-block;
  margin: 0.5em;
  text-align: center;
  border-radius: 20px;
  border: 1px solid var(--primary-color);
  padding: 0.2em 0.8em;
  width: 100px;
  height: auto;
  &:hover {
    background: var(--primary-gradient-color);
    color: #fff;
    cursor: pointer;
  }
`;

const DisplayTextCenter = styled.div`
  text-align: center;
`;

const BoldSpan = styled.span`
  font-weight: 700;
`;

const Passions = () => {
  const dispatch = useAppDispatch();
  const user: UserInterface = useAppSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [passions, setPassions] = useState<Tags[]>([]);
  const [allTags, setAllTags] = useState<Tags[]>([]);

  const handleClose = () => setShow(false);

  const updateDisplayedTags = async () => {
    try {
      const res = await getTags();
      const response = await getAllAvailableTags();
      const data = await res?.json();
      const dataAll = await response?.json();
      const userTags: Tags[] = data.tags;
      const allTags: Tags[] = dataAll.tags;
      setPassions([...userTags]);
      setAllTags(allTags);
      setShow(true);
    } catch (err) {
      console.log(`catch(err) gettings tags := ${err}`);
    }
  };

  const handleShow = () => {
    updateDisplayedTags();
    setShow(true);
  };

  const handleSubmit = () => {
    setShow(false);
  };

  const handleRemoveTag = async (tagId: number) => {
    await removeTag(tagId);
    await updateDisplayedTags();
    if (showAlert) {
      setShowAlert(false);
    } else {
      console.log(passions.length, showAlert);
    }
  };

  const handleAddTag = async (tagId: number) => {
    if (passions.length < 5) {
      await addTag(tagId);
      updateDisplayedTags();
    } else {
      setShowAlert(true);
    }
  };

  return (
    <>
      <LinkWrapper onClick={handleShow}>
        <LinkTo>
          <Row className="update-link cursor-pointer">
            <Col>Passions</Col>
          </Row>
        </LinkTo>
      </LinkWrapper>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        className="gray-one"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            Click bellow to add or remove tags (5 max)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            show={showAlert}
            variant="danger"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            <Alert.Heading>
              Oh snap! You already have the maximum number of tags allowed.
            </Alert.Heading>
            <p>
              You can have a maximum of <BoldSpan>five</BoldSpan> tags. If you
              want to add a new one, you need to remove one from yours.
            </p>
          </Alert>
          {passions.length === 0 && (
            <DisplayTextCenter>
              <h5>
                Please click on any tag bellow to add tags to your profile
              </h5>
              <p>
                You need at least one to activate your profile and a maximum of
                five.
              </p>
            </DisplayTextCenter>
          )}
          <Container>
            <Row>
              {passions.map((passion) => (
                <Col key={passion.id}>
                  <TagWrapper onClick={() => handleRemoveTag(passion.id)}>
                    {passion.name}
                  </TagWrapper>
                </Col>
              ))}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row>
              {allTags.map((tag) => (
                <Col key={tag.id}>
                  <TagWrapper onClick={() => handleAddTag(tag.id)}>
                    {tag.name}
                  </TagWrapper>
                </Col>
              ))}
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Passions;
