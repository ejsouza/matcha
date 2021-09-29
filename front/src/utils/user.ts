import { UserInterface } from 'interfaces';
import { LOGGED_USER } from 'utils/const';
import { UpdateUserInfoInterface } from 'api/user';

interface UserLocation {
  latitude: number | undefined;
  longitude: number | undefined;
}

const lookingFor = (user: UserInterface) => {
  let isLookingFor = '';
  if (user?.gender === 'female') {
    if (user.sexual_orientation === 'straight') {
      isLookingFor = 'Men';
    } else if (user.sexual_orientation === 'gay') {
      isLookingFor = 'Women';
    } else {
      isLookingFor = 'Men & Women';
    }
  } else {
    if (user?.sexual_orientation === 'straight') {
      isLookingFor = 'Women';
    } else if (user.sexual_orientation === 'gay') {
      isLookingFor = 'Men';
    } else {
      isLookingFor = 'Men & Women';
    }
  }
  return isLookingFor;
};

const aHundredLengthBio = (bio: string | undefined) => {
  if (!bio) return '';
  let aHundred = bio.substring(0, 97);
  aHundred += bio.length >= 97 ? '...' : '';
  return aHundred;
};

const getUserTokenFromLocalStorage = () => {
  const currentUser = localStorage.getItem(LOGGED_USER);

  if (!currentUser) {
    return '';
  }
  const data: UpdateUserInfoInterface = JSON.parse(currentUser);
  return data.token;
};

const getUserCity = async (location: UserLocation) => {
  const userGeolocation = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location?.latitude}&longitude=${location?.longitude}&localityLanguage=en`,
    {
      mode: 'cors',
    }
  );

  const userGeoData = await userGeolocation.json();
  console.log(`THE USER CITY IS  := ${userGeoData.locality}`);
  // setCity(userGeoData.locality);
  // setCountry(userGeoData.countryName);

  const city = userGeoData?.locality || '';
  return city;
};
export {
  lookingFor,
  aHundredLengthBio,
  getUserTokenFromLocalStorage,
  getUserCity,
};
