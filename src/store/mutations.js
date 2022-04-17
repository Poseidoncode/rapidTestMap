export default {
  m_setUserName(state, value) {
    state.user.name = value;
  },

  m_clearUserData(state) {
    state.user.name = "";
  },
};
