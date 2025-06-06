import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.182.57:8080",
    // baseURL: "http://localhost:8080",

});