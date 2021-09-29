import { Spinner } from 'react-bootstrap';

const Loading = () => {
  return (
    <>
      <Spinner animation="border" variant="primary">
        <Spinner animation="grow" variant="primary" size="sm" />
      </Spinner>
      <Spinner animation="border" variant="secondary">
        <Spinner animation="grow" variant="secondary" size="sm" />
      </Spinner>
      <Spinner animation="border" variant="success">
        <Spinner animation="grow" variant="success" size="sm" />
      </Spinner>
      <Spinner animation="border" variant="danger">
        <Spinner animation="grow" variant="danger" size="sm" />
      </Spinner>
      <Spinner animation="border" variant="warning">
        <Spinner animation="grow" variant="warning" size="sm" />
      </Spinner>
      <Spinner animation="border" variant="info">
        <Spinner animation="grow" variant="info" size="sm" />
      </Spinner>
      <Spinner animation="border" variant="dark">
        <Spinner animation="grow" variant="dark" size="sm" />
      </Spinner>
    </>
  );
};

export default Loading;
