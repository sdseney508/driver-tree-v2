import axios from "axios";
import apiURL from "./apiURL";

const createCarousel = () => {
  return axios.post(apiURL + "/carousel/");
};

const deleteCarousel = (id) => {  
  return axios.delete(apiURL + "/carousel/" + id);
};


const getCarousel = () => {
  return axios.get(apiURL + "/carousel/");
};

const putCarouselImage = (id, formData) => {  
  console.log(formData);
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  return axios.post(apiURL + "/carousel/" + id, formData, config);
};

const updateCarousel = (id, body) => {  
  console.log(body);
  return axios.put(apiURL + "/carousel/" + id, body);
};



export {
  createCarousel,
  deleteCarousel,
  getCarousel,
  putCarouselImage,
  updateCarousel
};
