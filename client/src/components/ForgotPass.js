import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { getCoords } from "../utils/drivers";

const ForgotPass = ({onModalSubmit}) => {
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [emails, setEmails] = useState("");
  
  useEffect(() => {
    getEmailAdds();
    setFormData({ ...formData, subject: "Op Limit Database Password Reset" });
  }, []);

  async function getEmailAdds() {
    let data = await getCoords().then((data) => {
      return data.data;
    });
    console.log(data);
    let dat='';
    for (let i = 0; i < data.length; i++) {
      dat = dat + data[i].email + ";";
    }
    setEmails(dat);
    return data;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      document.getElementById("contact-warning").classList.remove("d-none");
    } else {

      //   TODO: set timeout
      document.getElementById("contact-warning").classList.add("d-none");
      const url = `mailto:${emails}?subject=${formData.subject}&body=${formData.message}`;
      // debugger;
      window.open(url);
      onModalSubmit(e);
    }
  };
  return (
    <Container>
      <Row>
        <Col>
          <form className="" id="contact-form" onSubmit={handleSubmit}>
            <h3 className="">Contact Form:</h3>
            <div className="form-group">
              <label htmlFor="subject-input">Subject</label>
              <input
                type="text"
                className="form-control"
                id="subject-input"
                placeholder="Subject"
                name="subject"
                value="Op Limit Database Password Reset"
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message-input">Message</label>
              <textarea
                className="form-control"
                id="message-input"
                rows="3"
                placeholder="Message"
                name="message"
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                }}
              ></textarea>
            </div>
            <p className="" id="contact-warning">
              Both fields must be entered before pressing submit
            </p>
            <Button
              className="btn btn-primary bg-info rounded border-info ml-1 mt-3 mb-3"
              type="submit"
              id="email-button"
              onClick={handleSubmit}
            >
              Send Email
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPass;
