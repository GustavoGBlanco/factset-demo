export default {
  globers(state) {
    return state.globers;
  },
  hasGlobers(state) {
    return state.globers && state.globers.length > 0;
  },
  getEmail(state) {
    return state.email;
  },
  getFirstName(state) {
    return state.firstName;
  },
  getLastName(state) {
    return state.lastName;
  },
  getCity(state) {
    return state.city;
  },
  getTeam(state) {
    return state.team;
  },
  getRol(state) {
    return state.rol;
  },
  getSkills(state) {
    return state.skills;
  },
  shouldUpdate(state) {
    const lastFetch = state.lastFecth;

    if (!lastFetch) {
      return true;
    }

    const currentTimeStamp = new Date().getTime();
    return (currentTimeStamp - lastFetch) / 1000 > 60;
  }
}