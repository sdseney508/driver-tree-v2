//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { Container, Card, Form, Button } from "react-bootstrap";
import {
  createCarousel,
  deleteCarousel,
  getCarousel,
  putCarouselImage,
  updateCarousel,
} from "../utils/carousel";
import "./AdminCarouselManagementPage.css";
import "./button.css";
import { useNavigate, useLocation } from "react-router";

const AdminCarouselManage = () => {
  //this page will dsiplay all of the carousels on cards.  each card will have a delete and update button.  There will be a top button to add new carousel items.
  const [state, setState] = useContext(stateContext);
  //state variable for fil upload
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  //stores the full carousel array
  const [carousel, setCarousel] = useState({});
  //keep the entire carousel set in state so we can update the cards when we add or delete a carousel item
  const [carouselSet, setCarouselSet] = useState([]);

  let stateMap;
  let id;

  useEffect(() => {
    //fetch all of the datbase info to fill in the form to add or remove teams, functional areas, and systems.
    fetchData();
    carouselCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //this only fires on initial load, after that the form is fed by state and administrators input
  async function fetchData() {
    //get all of the carousels
    await getCarousel().then((data) => {
      setCarouselSet(data.data);
      //this is needed because you cant execute a map on a state variable
      stateMap = carouselSet;
    });
  }
  function handleFormSubmit(event) {
    event.preventDefault();
    let id = event.target.id;
    updateCarousel(id, carousel);
  }

  function handleChange(event) {
    event.preventDefault();
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name)
    console.log(file);
    handleFileSubmit(event);
  }

  function handleFileSubmit(event) {
    event.preventDefault();
    console.log(file);
    id = event.target.id;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('carouselImage', file.name);
    console.log(formData);
    putCarouselImage(id, formData);
  }

  const handleInputChange = (event) => {
    event.preventDefault();
    console.log(stateMap[event.target.dataset.id][event.target.name]);
    setCarousel({
      ...carousel,
      [event.target.name]: event.target.value
    });
    stateMap[event.target.dataset.id][event.target.name] = event.target.value;
  };

  function carouselCard() {
    stateMap =carouselSet;
    if (carouselSet.length === 0) {
      return <div>There are no carousels to display</div>;
    } else {

      return stateMap.map((f, index) => {
        return (
          <>
            <div key={f.id}>
              <div className="card">
                <Form>
                  <Form.Group>
                    <Form.Label htmlFor="Title">Carousel Title</Form.Label>
                    <Form.Control
                      type="string"
                      // this is for the array index for the carousel set to make sure i'm updating the correct one
                      name="carouselTitle"
                      data-id={index}
                      id={f.id}
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                      placeholder={f.carouselTitle}
                      value={carouselSet[index].carouselTitle}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="carouselText">
                      Carousel Text
                    </Form.Label>
                    <Form.Control
                      type="string"
                      data-id={index}
                      id={f.id}
                      onBlur={handleFormSubmit}
                      name="carouselText"
                      onChange={handleInputChange}
                      placeholder={f.carouselText}
                      value={carouselSet[index].carouselText}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="carouselLink">
                      Carousel Link
                    </Form.Label>
                    <Form.Control
                      type="string"
                      name="carouselLink"
                      id={f.id}
                      onBlur={handleFormSubmit}
                      data-id={index}
                      onChange={handleInputChange}
                      placeholder={f.carouselLink}
                      value={carouselSet[index].carouselLink}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="carouselImage">
                      Carousel Image
                    </Form.Label>
                    <input type="file" id={f.id} onChange={handleChange} />
                  </Form.Group>

                </Form>
              </div>
              <br />
            </div>
          </>
        );
      });
    }
    // return outerArr;
  }

  function createItem() {
    //create a new carousel item
    alert("Disabled For Demo");
    let carouselLink = "https://www.google.com";
    let carouselImage = "";
    let carouselText = "This is a test carousel item";
    let body = { carouselLink, carouselImage, carouselText };
    createCarousel(body);
  }

  return (
    <div className="op-limits-page" >
      <h1>Carousel Management</h1>
      <br />
      <Button variant="primary" onClick={() => createItem()}>
        Add Carousel Item
      </Button>
      <Container>
        <h1>Carousel Items</h1>
        {carouselCard()}
      </Container>
    </div>
  );
};

export default AdminCarouselManage;
