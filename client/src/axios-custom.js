import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json"
  }
});

// if (localStorage.getItem("token")) {
//   instance.defaults.headers.common["x-auth-token"] = localStorage.getItem(
//     "token"
//   );
// } else {
//   delete instance.defaults.headers.common["x-auth-token"];
// }

export default instance;
