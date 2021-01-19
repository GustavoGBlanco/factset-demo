export default {
  registerGlober(state, payload) {
    state.globers.push(payload);
  },
  setGlobers(state, payload) {
    state.globers = payload;
  },
  setFirstName(state, payload) {
    state.firstName = payload;
  },
  setLastName(state, payload) {
    state.lastName = payload;
  },
  setCity(state, payload) {
    state.city = payload;
  },
  setTeam(state, payload) {
    state.team = payload;
  },
  setRol(state, payload) {
    state.rol = payload;
  },
  setSkills(state, payload) {
    state.skills = payload.slice();
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime();
  }
}