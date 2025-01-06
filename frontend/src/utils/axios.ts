import { BACKEND_URL } from "@/constants/url";
import axios from "axios";

const  customAxios = axios.create({
    baseURL:BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
    
  });    
export default customAxios;
