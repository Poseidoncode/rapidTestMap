import state from "./state";

const generateOptions = (item) => {
  const No = item.No || item.Id || item.value;
  const Name = item.Name || item.text;
  return { NO, Name, Id: No, value: No, text: Name };
};

export default {
  g_userName(state) {
    return state.user.name;
  },
};
