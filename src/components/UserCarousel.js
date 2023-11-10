import React, { useState, useEffect } from "react";
import { getCarousel } from "../utils/carousel";
import Carousel from "react-bootstrap/Carousel";
import "./UserCarousel.css";

function UserCarousel() {
  const [index, setIndex] = useState(0);
  const [carousels, setCarousels] = useState([]);

  // setCarousels(getCarousel);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  // useEffect(() => {
  //   const getCarouselData = async () => {
  //     try {
  //       const response = await getCarousel();
  //       if (!response.data) {
  //         throw new Error("something went wrong!");
  //       }
  //       const carousel = response.data;
  //       console.log(carousel);
  //       setCarousels(carousel);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   getCarouselData();
  //   console.log("carousel data", carousels)
  // }, []);


  function carouselItems() {
    return carousels.map((f, index) => {
      return (
        <Carousel.Item style={{ textAlign: "center" }}>
          <img src="https://picsum.photos/500/300?img=1" alt="First slide" />
          <Carousel.Caption>
            <h3>{f.courselTitle}</h3>
            <a href={f.carouselLink} style={{ color: "white" }}>
              {f.carouselText}
            </a>
          </Carousel.Caption>
        </Carousel.Item>
      );
    });
  }

  //for now these are hard coded.  For final deployment, they'll reference the OLDB database carousel model.  They execute a get request to the carousel model and then map through the results to display the images, links, and captions.

    <Carousel  activeIndex={index} onSelect={handleSelect}>
    <Carousel.Item style={{textAlign: 'center'}}>
      <img
        src="https://picsum.photos/500/300?img=1"
        alt="First slide"
      />
      <Carousel.Caption>
        <h3>IFC Schedule</h3>
        <a href="https://www.espn.com" style={{ color: "white" }}>
          Show an IFC Schedule here
        </a>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item style={{textAlign: 'center'}}>
      <img
        src="https://picsum.photos/500/300?img=2"
        alt="Second slide"
      />
      <Carousel.Caption>
        <h3>Flight Test Schedule</h3>
        <a href="https://www.golf.com" style={{ color: "white" }}>
          And any other info that we think will be important as a carousel
          style announcement. These could also be links to the PMA Sharepoint.
          For an example this sends you to Golf.com
        </a>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item style={{textAlign: 'center'}}>
      <img
        src="https://picsum.photos/500/300?img=3"
        alt="Third slide"
      />
      <Carousel.Caption>
        <h3>PMA Sharepoint Site</h3>
        <a href="https://www.golf.com" style={{ color: "white" }}>
          And any other info that we think will be important as a carousel
          style announcement. These could also be links to the PMA Sharepoint.
          For an example this sends you to Golf.com
        </a>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>

  return (
    // legacy code before i make it dynamic from the database
    // <Carousel activeIndex={index} onSelect={handleSelect}>
    //   {carouselItems}
    // </Carousel>
    <Carousel  activeIndex={index} onSelect={handleSelect}>
    <Carousel.Item style={{textAlign: 'center'}}>
      <img
        src="https://picsum.photos/500/300?img=1"
        alt="First slide"
      />
      <Carousel.Caption>
        <h3>IFC Schedule</h3>
        <a href="https://www.espn.com" style={{ color: "white" }}>
          Show an IFC Schedule here
        </a>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item style={{textAlign: 'center'}}>
      <img
        src="https://picsum.photos/500/300?img=2"
        alt="Second slide"
      />
      <Carousel.Caption>
        <h3>Flight Test Schedule</h3>
        <a href="https://www.golf.com" style={{ color: "white" }}>
          And any other info that we think will be important as a carousel
          style announcement. These could also be links to the PMA Sharepoint.
          For an example this sends you to Golf.com
        </a>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item style={{textAlign: 'center'}}>
      <img
        src="https://picsum.photos/500/300?img=3"
        alt="Third slide"
      />
      <Carousel.Caption>
        <h3>PMA Sharepoint Site</h3>
        <a href="https://www.golf.com" style={{ color: "white" }}>
          And any other info that we think will be important as a carousel
          style announcement. These could also be links to the PMA Sharepoint.
          For an example this sends you to Golf.com
        </a>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
  );
}
export default UserCarousel;
