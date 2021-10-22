import { UserInterface } from 'interfaces';
import { LOGGED_USER, USER_TOKEN } from 'utils/const';
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
  const token = localStorage.getItem(USER_TOKEN);

  if (!token) {
    return '';
  }
  return token;
};

const getUserIdFromLocalStorage = () => {
  const currentUser = localStorage.getItem(LOGGED_USER);

  if (!currentUser) {
    console.log(`getUserIdFromLocalStorage(ERROR)`);
    return undefined;
  }
  const user: UpdateUserInfoInterface = JSON.parse(currentUser);
  console.log(`getUserIdFromLocalStorage(${user.id})`);
  return user.id;
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

const calculateAge = (birthDate: string) => {
  if (!birthDate.length) {
    return 25;
  }
  const birth = new Date(birthDate);
  const birthDay = Number(birth.getDate());
  const birthMonth = Number(birth.getMonth());
  const birthYear = Number(birth.getFullYear());

  const today = new Date();
  const todayDay = Number(today.getDate());
  const todayMonth = Number(today.getMonth());
  const todayYear = Number(today.getFullYear());

  let age = todayYear - birthYear;
  if (birthMonth > todayMonth) {
    age--;
  }
  if (birthMonth === todayMonth && todayDay < birthDay) {
    age--;
  }
  return age;
};

export {
  lookingFor,
  aHundredLengthBio,
  getUserTokenFromLocalStorage,
  getUserIdFromLocalStorage,
  getUserCity,
  calculateAge,
};
