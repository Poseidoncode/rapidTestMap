import axios from "axios";
import store from "../store";
import dayjs from "dayjs";
// import router from "../router";
// import { useRouter } from "vue-router";
export default function ajax({ url, method = "get", data = null }) {
  return new Promise((resolve, reject) => {
    let headers = Object.assign({
      "Content-Type": "application/json",
      Authorization: `${
        sessionStorage.getItem("token")
          ? sessionStorage.getItem("token").replace(/\"/g, "")
          : ""
      }`,
    });

    const instance = axios.create({
      headers,
      baseURL:
        process.env.NODE_ENV === "development"
          ? "https://data.cdc.gov.tw/api/3/"
          : "https://data.cdc.gov.tw/api/3/",

      timeout: 8000,
    });
    const applayInstance =
      method === "get"
        ? instance.get
        : method === "post"
        ? instance.post
        : method === "put"
        ? instance.put
        : instance.delete;

    applayInstance(url, data)
      .then((res) => {
        resolve(res);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}
