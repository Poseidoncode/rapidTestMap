import ajax from "./ajax";
import axios from "axios";
import store from "../store";

// import dayjs from "dayjs";

export const getMapLists = (qs = "") =>
  ajax({
    url: "action/datastore_search?resource_id=aff77243-8104-46a4-92c9-046bccca6941&limit=50",
  });
