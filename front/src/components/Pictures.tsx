import { useEffect, useState } from 'react';
import { Modal, Carousel, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import UpdateLink from './Desktop/UpdateLink';
import Button from './Button';
import { uploadPicture, getPictures, deletePicture } from 'api/picture';
import { FlexBox, Gap } from 'globalStyled';
import womanOne from 'assets/img/womanOne.jpg';

const ImgPreview = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
`;

const ImgWrapper = styled.div`
  width: 200px;
  height: 300px;
  margin: auto;
`;

const CarouselPictures = styled.img`
	width="300"
	height="500"
	object-fit="cover"
`;

const Delete = styled.div`
  position: absolute;
  top: 6%;
  right: 38.5%;
  cursor: pointer;
`;

const DeleteFromGallery = styled.div`
  position: relative;
  top: 10%;
  left: 85%;
  cursor: pointer;
`;

interface PicturesInterface {
  id: number;
  user_id: number;
  created: Date;
  path: string;
}
const Pictures = () => {
  const [show, setShow] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | undefined>();
  const [showAlert, setShowAlert] = useState(false);
  const [variant, setVariant] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [updateCarousel, setUpdateCorousel] = useState(true);
  const [pictures, setPictures] = useState<PicturesInterface[]>([]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectURL = URL.createObjectURL(selectedFile);
    setPreview(objectURL);

    console.log(objectURL);
    // free memory othewise we get memory leak
    return () => URL.revokeObjectURL(objectURL);
  }, [selectedFile]);

  const getGallery = () => {
    getPictures()
      .then((res) => {
        if (!res || !res.ok) {
          console.log(`something went worong getting user pictures`);
          return;
        }
        res.json().then((pictures: PicturesInterface[]) => {
          setPictures(pictures);
          pictures.forEach((picture) => console.log(picture.path));
        });
      })
      .catch((err) => {
        console.log(`Error getting user pictures := ${err}`);
      });
  };
  useEffect(() => {
    console.log(`getting pictues`);
    getGallery();
  }, [updateCarousel]);

  const handleClose = () => {
    setShow(false);
    setShowUploadModal(false);
    setPreview(undefined);
    setSelectedFile(undefined);
  };
  const handleShow = () => setShow(true);

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setShow(true);
  };

  const handleShowPictureManager = () => {
    setShow(false);
    setShowUploadModal(true);
    setUpdateCorousel(!updateCarousel);
  };

  // handle file upload
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
    } else {
      setSelectedFile(e.target.files[0]);
    }
  };
  const removePreview = () => {
    setPreview(undefined);
    setSelectedFile(undefined);
  };

  const deletePictureFromGallery = (id: number) => {
    console.log(`removing picture with id ${id}`);
    deletePicture(id)
      .then((res) => {
        if (!res || !res.ok) {
          console.log(`something went worong deleting picture`);
          return;
        }
        getGallery();
      })
      .catch((err) => {
        console.log(`Error deleting pictures := ${err}`);
      });
  };

  const uploadPictureToApi = () => {
    if (selectedFile) {
      uploadPicture(selectedFile)
        ?.then((res) => {
          if (!res?.ok) {
            setVariant('danger');
            setAlertMsg(
              'Something went wrong, your file upload failed. You can retry later.'
            );
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              setVariant('');
            }, 2000);
            return;
          }
          setPreview(undefined);
          setSelectedFile(undefined);
          setVariant('success');
          setAlertMsg('Picture uploaded successfully!');
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            setVariant('');
          }, 2000);
        })
        .catch((err) => {
          setVariant('danger');
          setAlertMsg(
            'Something went wrong, your file upload failed. You can retry later.'
          );
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            setVariant('');
          }, 2000);
        });
    }
  };
  return (
    <>
      <UpdateLink title="Pictures" symbol=">" link="#" setEvent={handleShow} />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{ backgroundColor: '#252932' }}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        {show && (
          <Modal.Body>
            <Carousel>
              <Carousel.Item>
                <CarouselPictures
                  className="d-block w-100"
                  src={womanOne}
                  alt="First slide"
                  width="300"
                  height="500"
                />
                <Carousel.Caption></Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <CarouselPictures
                  className="d-block w-100"
                  src={womanOne}
                  alt="Second slide"
                  width="300"
                  height="500"
                />

                <Carousel.Caption></Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <CarouselPictures
                  className="d-block w-100"
                  src={womanOne}
                  alt="Third slide"
                  width="300"
                  height="500"
                />

                <Carousel.Caption></Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button text="Manage pictures" callBack={handleShowPictureManager} />
        </Modal.Footer>
      </Modal>
      {/* Handle upload picture modal */}
      <Modal
        show={showUploadModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{ backgroundColor: '#252932' }}
        size="lg"
      >
        <Alert show={showAlert} variant={variant}>
          <Alert.Heading>
            {variant === 'success'
              ? 'Success'
              : variant === 'danger'
              ? 'Error'
              : ''}
          </Alert.Heading>
          <p>{alertMsg}</p>
        </Alert>
        <Modal.Header closeButton>
          <Modal.Title className="gray-one">Manage pictures</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedFile && (
            <>
              <FlexBox flexWrap="wrap" gap="10px">
                {pictures.map((picture) => {
                  let path = picture.path;
                  return (
                    <ImgWrapper key={picture.id}>
                      <DeleteFromGallery
                        onClick={() => deletePictureFromGallery(picture.id)}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="closeCross">
                            <g id="mainCrossIcon">
                              <path
                                id="forwardVector"
                                d="M1.55543 24C1.15739 24 0.759067 23.8477 0.456123 23.5444C-0.152041 22.9365 -0.152041 21.9537 0.456123 21.3458L21.3453 0.455919C21.9531 -0.151973 22.936 -0.151973 23.5439 0.455919C24.152 1.06381 24.152 2.04669 23.5439 2.65458L2.65474 23.5444C2.3498 23.8491 1.95347 24 1.55543 24Z"
                                fill="url(#paint0_linear)"
                              />
                              <path
                                id="backwardVector"
                                d="M22.4446 24C22.0465 24 21.6485 23.8477 21.3453 23.5444L0.456123 2.65458C-0.152041 2.04669 -0.152041 1.06381 0.456123 0.455919C1.064 -0.151973 2.04658 -0.151973 2.65474 0.455919L23.5439 21.3458C24.152 21.9537 24.152 22.9365 23.5439 23.5444C23.2406 23.8491 22.8426 24 22.4446 24V24Z"
                                fill="url(#paint1_linear)"
                              />
                            </g>
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear"
                              x1="12"
                              y1="0"
                              x2="12"
                              y2="24"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#F44336" stopOpacity="0.6" />
                              <stop offset="0.505208" stopColor="#F44336" />
                              <stop
                                offset="0.963542"
                                stopColor="#FF655B"
                                stopOpacity="0.67"
                              />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear"
                              x1="12"
                              y1="0"
                              x2="12"
                              y2="24"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#F44336" stopOpacity="0.6" />
                              <stop offset="0.505208" stopColor="#F44336" />
                              <stop
                                offset="0.963542"
                                stopColor="#FF655B"
                                stopOpacity="0.67"
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                      </DeleteFromGallery>
                      <ImgPreview
                        src={`https://images.unsplash.com/photo-1631355900166-e2974bbf2ab7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80`}
                        width="120"
                        height="80"
                      />
                    </ImgWrapper>
                  );
                })}
              </FlexBox>
              &nbsp;
            </>
          )}
          {!selectedFile && <Gap>&nbsp;</Gap>}

          <div className="file-input">
            {!selectedFile && (
              <>
                <input
                  type="file"
                  id="file"
                  className="file"
                  onChange={onSelectFile}
                />
                <label htmlFor="file">Select picture</label>
              </>
            )}
            {selectedFile && (
              <ImgWrapper>
                <Delete onClick={removePreview}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="closeCross">
                      <g id="mainCrossIcon">
                        <path
                          id="forwardVector"
                          d="M1.55543 24C1.15739 24 0.759067 23.8477 0.456123 23.5444C-0.152041 22.9365 -0.152041 21.9537 0.456123 21.3458L21.3453 0.455919C21.9531 -0.151973 22.936 -0.151973 23.5439 0.455919C24.152 1.06381 24.152 2.04669 23.5439 2.65458L2.65474 23.5444C2.3498 23.8491 1.95347 24 1.55543 24Z"
                          fill="url(#paint0_linear)"
                        />
                        <path
                          id="backwardVector"
                          d="M22.4446 24C22.0465 24 21.6485 23.8477 21.3453 23.5444L0.456123 2.65458C-0.152041 2.04669 -0.152041 1.06381 0.456123 0.455919C1.064 -0.151973 2.04658 -0.151973 2.65474 0.455919L23.5439 21.3458C24.152 21.9537 24.152 22.9365 23.5439 23.5444C23.2406 23.8491 22.8426 24 22.4446 24V24Z"
                          fill="url(#paint1_linear)"
                        />
                      </g>
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="12"
                        y1="0"
                        x2="12"
                        y2="24"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#F44336" stopOpacity="0.6" />
                        <stop offset="0.505208" stopColor="#F44336" />
                        <stop
                          offset="0.963542"
                          stopColor="#FF655B"
                          stopOpacity="0.67"
                        />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear"
                        x1="12"
                        y1="0"
                        x2="12"
                        y2="24"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#F44336" stopOpacity="0.6" />
                        <stop offset="0.505208" stopColor="#F44336" />
                        <stop
                          offset="0.963542"
                          stopColor="#FF655B"
                          stopOpacity="0.67"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </Delete>
                <ImgPreview
                  src={preview}
                  alt="upload-image"
                  width="240"
                  height="180"
                />
              </ImgWrapper>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {preview && (
            <Button
              text="Upload picture"
              callBack={uploadPictureToApi}
              borderRadius="20px"
            />
          )}
          <Button
            text="Back to pictures"
            callBack={handleCloseUploadModal}
            borderRadius="20px"
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Pictures;
