import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { getEmails } from "../utils/drivers";

const Contact = ({onModalSubmit}) => {
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [emails, setEmails] = useState("");
  useEffect(() => {
    getEmailAdds();
  }, []);

  async function getEmailAdds() {
    let data = await getEmails().then((data) => {
      return data.data;
    });
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

      document.getElementById("contact-warning").classList.add("d-none");
      const url = `mailto:${emails}?subject=${formData.subject}&body=${formData.message}`;
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
                value={formData.subject}
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
            <button
              className="btn btn-primary bg-info rounded border-info ml-1 mt-3 mb-3"
              type="submit"
              id="email-button"
            >
              Send Email
            </button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
