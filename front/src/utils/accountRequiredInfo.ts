import { UserInterface } from 'interfaces';

const isProfileComplete = (profile: UserInterface) => {
  if (!profile.biography?.length) {
    return false;
  }

  if (!profile.gender?.length) {
    return false;
  }

  if (!profile.birthdate) {
    return false;
  }

  /**
   * Those below can be changed but they are supplied during
   * the account creation, so less probability to be false
   */
  if (profile.firstname.length < 3) {
    return false;
  }

  if (profile.lastname.length < 3) {
    return false;
  }

  if (profile.username.length < 3) {
    return false;
  }

  return true;
};

export { isProfileComplete };
