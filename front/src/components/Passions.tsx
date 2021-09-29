import { useState } from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { userInfoUpdated } from 'store/actions';
import { LinkTo, LinkWrapper } from './Desktop/UpdateLink';
import { UserInterface } from 'interfaces';
import { getUser, updateUserInfo, UpdateUserInfoInterface } from 'api/user';
import { SUCCESS } from 'utils/const';

const Passions = () => {
  const dispatch = useAppDispatch();
  const user: UserInterface = useAppSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [passions, setPassions] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    setShow(false);
    const usr: UpdateUserInfoInterface = {};
    usr.tags = [];
    // const cleanPassions = passions.replace(/,|#|\d/gi, '');
    // const pArr = cleanPassions.split(' ');
    // console.log(`before ${pArr} -- ${user.tags.length}`);

    // for (let i = 0; i < pArr.length; i++) {
    //   let p = pArr[i];
    //   if (p.length && !user.tags.includes(p) && user.tags.length <= 5) {
    //     console.log(`p := ${p}`);
    //     usr.tags.push(p);
    //   }
    // }
    setPassions('');
    console.log(`>> ${usr.tags}`);
    if (usr.tags.length > 0) {
      updateUserInfo(usr).then((res) => {
        if (res?.status === SUCCESS) {
          getUser(user.token).then((res) => {
            if (res.status === SUCCESS) {
              res.json().then((userUpdated: UserInterface) => {
                dispatch(userInfoUpdated({ ...userUpdated }));
              });
            }
          });
        }
      });
    }
  };
  return (
    <>
      <LinkWrapper onClick={handleShow}>
        <LinkTo>
          <Row className="update-link cursor-pointer">
            <Col>Passions</Col>
            {/* {user.tags.map((p) => (
              <Col key={p}>{p}</Col>
            ))} */}
          </Row>
        </LinkTo>
      </LinkWrapper>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="sm"
        className="gray-one"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Passion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="passions">
              <Form.Label>Add passions separated by space (5)</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setPassions(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleSubmit}
            className="w-100 theme-background-on-hover"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Passions;
