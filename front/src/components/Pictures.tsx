import { useEffect, useState } from 'react';
import { Modal, Carousel, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import UpdateLink from './desktop/UpdateLink';
import Button from './Button';
import * as picture from 'api/picture';
import { getUser, updateUserInfo, UpdateUserInfoInterface } from 'api/user';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { userInfoUpdated } from 'store/actions';
import { UserInterface } from 'interfaces';
import { FlexBox, Gap } from 'globalStyled';
import { API_BASE_URL } from 'utils/config';
import setToDefaultPictureSVG from '../assets/icons/conversion-settings.svg';
import defaultPictureSVG from '../assets/icons/default.svg';
import closeCrossSVG from '../assets/icons/closeCross.svg';
import { CREATED, SUCCESS } from 'utils/const';

const ImgPreview = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
`;

const ImgWrapper = styled.div`
  width: 200px;
  height: 350px;
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

const SetAsDefault = styled.div`
  position: relative;
  top: 18%;
  left: 2%;
  cursor: pointer;
`;

const DeleteFromGallery = styled.div`
  position: relative;
  top: 9%;
  left: 85%;
  cursor: pointer;
`;

const NoPictureMessage = styled.div`
  color: red;
  text-align: center;
`;

interface PicturesInterface {
  id: number;
  user_id: number;
  file_path: string;
}
const Pictures = () => {
  const dispatch = useAppDispatch();
  const user: UserInterface = useAppSelector((state) => state.user);
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

    // free memory othewise we get memory leak
    return () => URL.revokeObjectURL(objectURL);
  }, [selectedFile]);

  useEffect(() => {
    if (user.id && !user.default_picture) {
      setShow(true);
    }
  }, [user, show]);

  const getGallery = async () => {
    const res = await picture.get();

    if (res.status === SUCCESS) {
      const json = await res.json();
      const pictures: PicturesInterface[] = json.pictures;
      setPictures(pictures);
      if (!pictures.length && user.default_picture) {
        let usr: UpdateUserInfoInterface = {};
        usr.default_picture = '';
        const response = await updateUserInfo(usr);
        if (response.status === CREATED) {
          const userJson = await response.json();
          const userData: UserInterface = userJson.user;

          dispatch(userInfoUpdated({ ...userData }));
        }
      }
    }
  };

  useEffect(() => {
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
    picture
      .remove(id)
      .then((res) => {
        if (!res || !res.ok) {
          return;
        }
        getGallery();
        getUser().then((res) => {
          res.json().then((data) => {
            const updatedUser: UserInterface = data;
            dispatch(userInfoUpdated({ ...updatedUser }));
          });
        });
      })
      .catch((err) => {
        console.log(`Error deleting pictures := ${err}`);
      });
  };

  const uploadPictureToApi = () => {
    if (selectedFile) {
      picture
        .upload(selectedFile)
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
          getGallery();
          setPreview(undefined);
          setSelectedFile(undefined);
          setVariant('success');
          setAlertMsg('Picture uploaded successfully!');
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            setVariant('');
          }, 2000);
          getUser().then((res) => {
            res.json().then((data) => {
              const updatedUser: UserInterface = data;
              dispatch(userInfoUpdated({ ...updatedUser }));
            });
          });
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

  const handleSetPictureToDefault = async (path: string) => {
    /**
     * If user clicks on the already default picture just return;
     */
    if (!path || path === user.default_picture) {
      return;
    }
    const res = await picture.setDefault(path);
    if (res.status === CREATED) {
      const response = await getUser();
      if (response.status === SUCCESS) {
        const usr: UserInterface = await response.json();
        dispatch(userInfoUpdated({ ...usr }));
        setVariant('success');
        setAlertMsg('Default picture updated');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setVariant('');
        }, 2000);
      }
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
            {!user.default_picture && (
              <NoPictureMessage>
                <p>You don't have any picture yet!</p>
                <p> You need at least one to use the app!</p>
              </NoPictureMessage>
            )}
            <Carousel>
              {pictures.map((picture) => {
                const path = `${API_BASE_URL}/uploads/${picture.file_path}`;
                return (
                  <Carousel.Item key={picture.id}>
                    <CarouselPictures
                      className="d-block w-100"
                      src={path}
                      alt="Second slide"
                      width="300"
                      height="500"
                    />

                    <Carousel.Caption></Carousel.Caption>
                  </Carousel.Item>
                );
              })}
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
                  const path = `${API_BASE_URL}/uploads/${picture.file_path}`;
                  return (
                    <ImgWrapper key={picture.id}>
                      <SetAsDefault
                        onClick={() =>
                          handleSetPictureToDefault(picture.file_path)
                        }
                      >
                        {picture.file_path === user.default_picture ? (
                          <img
                            src={defaultPictureSVG}
                            alt="default-pic-svg"
                            style={{ cursor: 'default' }}
                          />
                        ) : (
                          <img
                            src={setToDefaultPictureSVG}
                            alt="set-default-pic-svg"
                          />
                        )}
                      </SetAsDefault>
                      <DeleteFromGallery
                        onClick={() => deletePictureFromGallery(picture.id)}
                      >
                        <img src={closeCrossSVG} alt="close-cross-svg" />
                      </DeleteFromGallery>
                      <ImgPreview src={path} width="120" height="80" />
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
                  name="uploaded_file"
                  className="file"
                  onChange={onSelectFile}
                  disabled={pictures.length >= 5}
                />
                <label htmlFor="file">
                  {pictures.length >= 5
                    ? `Max photos 5 (remove to upload)`
                    : 'Select picture'}
                </label>
              </>
            )}

            {selectedFile && (
              <ImgWrapper>
                <Delete onClick={removePreview}>
                  <img src={closeCrossSVG} alt="close-cross-svg" />
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