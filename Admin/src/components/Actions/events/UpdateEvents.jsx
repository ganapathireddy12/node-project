import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import axios from "axios";
import VolunteerCard from "../volunteers/VolunteerCard";

import toast, { Toaster } from "react-hot-toast";


const UpdateEvent = ({ isOpen, toggle, volunteer }) => {
  const [formData, setFormData] = useState({
    name: "",
    venues: [""],
    date: "",
    finalPath: null,
  });
  const [dispImage, setDispImage] = useState(null); // State to display image preview
  const [errors, setErrors] = useState({});
  const imageRef = useRef(null); // Use ref for the image input

  useEffect(() => {
    if (volunteer) {
      // console.log(volunteer.venues)
      setFormData({
        name: volunteer.name || "",
        venues: volunteer.venue || [""], // Handle multiple venues
        // venues: ["RTB", "BGB"],
        date: volunteer.date || "",
        finalPath: null, // Clear image
      });
      setDispImage(volunteer.finalPath); // Display passed image or default
    }
  }, [volunteer]);

  const handleChange = (e, index = null) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, finalPath: files[0] });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setDispImage(fileReader.result);
      };
      fileReader.readAsDataURL(files[0]);
      setErrors({ ...errors, finalPath: "" });
    } else if (name === "venues" && index !== null) {
      const updatedVenues = [...formData.venues];
      updatedVenues[index] = value;
      setFormData({ ...formData, venues: updatedVenues });
      setErrors({ ...errors, venues: "" });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const port = import.meta.env.VITE_BACKEND_PORT;

  const handleAddVenue = () => {
    setFormData({ ...formData, venues: [...formData.venues, ""] });
  };

  const handleRemoveVenue = (index) => {
    if (formData.venues.length > 1) {
      const updatedVenues = formData.venues.filter((_, i) => i !== index);
      setFormData({ ...formData, venues: updatedVenues });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }

    if (formData.venues.some((venue) => !venue.trim())) {
      newErrors.venues = "All venue fields are required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    return newErrors;
  };

  // const handleSave = (e) => {
  //   e.preventDefault(); // Prevent form submission from refreshing the page
  //   const newErrors = validateForm();

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //   } else {

  //     console.log(formData);
  //     let updatedData = {};

  //     if (formData.name)  updatedData["EventName"] = formData.name;
  //     if (formData.venues) updatedData["Place"] = formData.venues;
  //     if (formData.date) updatedData["Date"] = formData.date;
  //     if (formData.finalPath) {
  //       updatedData["image"] = formData.finalPath;
  //     }
  //     updatedData["userID"] = volunteer.id;

  //     console.log(updatedData)





  //     axios
  //       .put(port + "update-event", updatedData)
  //       .then((response) => {
  //         console.log("Updated Event Data: ", response.data);
  //         toast.success("Event data updated successfully");
  //       })
  //       .catch((error) => {
  //         console.error("There was an error updating the event!", error);
  //       });

  //     toggle(); // Close modal after saving
  //   }
  // };
  // const port = process.env.REACT_APP_SERVER_PORT;

  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    const port = import.meta.env.VITE_BACKEND_PORT;


    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
    } else {
        const formDataToSend = new FormData();
        formDataToSend.append('EventName', formData.name);
        formDataToSend.append('Place', JSON.stringify(formData.venues));
        formDataToSend.append('Date', new Date(formData.date));

        if (formData.finalPath) {
            formDataToSend.append('image', formData.finalPath); // Append image if uploaded
        }

        formDataToSend.append('userID', volunteer.id); // Append event ID

        axios
            .put(port + 'update-event', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                console.log('Updated Event Data: ', response.data);
                toast.success('Event data updated successfully');
                toggle(); // Close modal

                setTimeout(() => {
                  window.location.reload();
                }, 500);
            })
            .catch((error) => {
                console.error('Error updating event:', error);
                toast.error('Failed to update event');
            });
    }
};


  return (
    <>
    <Toaster />
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {volunteer ? `Details of ${formData.name}` : "Event Details"}
      </ModalHeader>
      <Form onSubmit={handleSave}>
        <ModalBody>
          <Row className="details_group">
            <FormGroup className="mb-3 image-div" style={{ position: "relative" }}>
              <img
                src={dispImage ? dispImage : port + "Events/" + volunteer.finalPath}
                alt="event"
                className="event-image"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                className="image-div"
                style={{
                  position: "absolute",
                  opacity: 0,
                  height: "180px",
                  width: "100%",
                  top: 0,
                  left: 0,
                  cursor: "pointer",
                }}
                ref={imageRef}
                onChange={handleChange}
              />
              {errors.finalPath && (
                <div className="text-danger" style={{ marginTop: "8px" }}>
                  {errors.finalPath}
                </div>
              )}
            </FormGroup>
          </Row>

          <Row className="details_group">
            <FormGroup className="mb-3 col-lg-12">
              <Label for="name">Event Name:</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter event name"
                onChange={handleChange}
                className={errors.name ? "is-invalid" : ""}
              />
              {errors.name && (
                <div className="text-danger" style={{ marginTop: "8px" }}>
                  {errors.name}
                </div>
              )}
            </FormGroup>
          </Row>

          <Row className="details_group">
            <FormGroup className="mb-3 col-lg-12">
              <Label>Venues:</Label>

          
              {formData.venues.map((venue, index) => (
                <div key={index} className="mb-2 d-flex align-items-center">
                  <Input
                    type="text"
                    name="venues"
                    value={venue}
                    placeholder={`Venue ${index + 1}`}
                    onChange={(e) => handleChange(e, index)}
                    className={errors.venues ? "is-invalid" : ""}
                  />
                  {formData.venues.length > 1 && (
                    <Button

                      color="link"
                      text
                      size="sm"
                      className="ms-2 text-muted"
                      style={{"textDecoration": "none", "border": "1px solid"}}
                      onClick={() => handleRemoveVenue(index)}
                    >
                      x
                    </Button>
                  )}
                </div>
              ))}
              <Button
                color="link"
                size="sm"
                className="mt-2 text-muted"
                onClick={handleAddVenue}
              >
                + Add Another Venue
              </Button>
              {errors.venues && (
                <div className="text-danger" style={{ marginTop: "8px" }}>
                  {errors.venues}
                </div>
              )}
            </FormGroup>
          </Row>

          <Row className="details_group">
            <FormGroup className="mb-3 col-lg-12">
              <Label for="date">Date:</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? "is-invalid" : ""}
              />
              {errors.date && (
                <div className="text-danger" style={{ marginTop: "8px" }}>
                  {errors.date}
                </div>
              )}
            </FormGroup>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" className="btn-outline-primary" style={{color: "white"}}>
            Save Changes
          </Button>
          <Button className="btn-outline-warning" onClick={toggle} >
            Close
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
    </>
  );
};



export default UpdateEvent;
