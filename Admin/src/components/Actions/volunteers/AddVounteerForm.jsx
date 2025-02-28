import React, { useState, useEffect } from "react";
import {
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "reactstrap";
import axios from "axios";


const AddVolunteerForm = ({ isOpen, toggle, onAdd }) => {

  // const port = import.meta.env.REACT_APP_SERVER_PORT;
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    mobile: "",
    branch: "",
    type: "Student",
    linkedin: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      clearForm();
      clearErrors();
    }
  }, [isOpen]);

  const port = import.meta.env.VITE_BACKEND_PORT;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };
  const inputStyles = (error) => ({
    border: error ? "1px solid red" : undefined,
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "Volunteer code is required";
    if (!formData.name.trim()) newErrors.name = "Volunteer name is required";
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.branch.trim()) newErrors.branch = "Branch is required";
    if (!formData.type) newErrors.type = "Type is required";
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const ActualData = {
          TypeOfVolunteer: formData.type,
          Name: formData.name,
          Id: formData.code,
          PhoneNumber: formData.mobile,
          Branch: formData.branch,
          LinkedInProfile: formData.linkedin,
        };

        const response = await axios.post( port + "add-volunteers-data", ActualData);

        // Call the onAdd callback to update the list in ShowVolunteers
        onAdd(response.data);

        clearForm();
        toggle();
      } catch (error) {
        console.error("Error saving volunteer data: ", error);
      }
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      code: "",
      mobile: "",
      branch: "",
      type: "",
      linkedin: "",
    });
  };

  const clearErrors = () => {
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add Volunteer Details</ModalHeader>
      <ModalBody>
        <Row className="details_group">
          <div className="mb-3 col-lg-6">
            <span>Volunteer Code:</span>
            <Input
              type="text"
              name="code"
              value={formData.code}
              placeholder={errors.code ? errors.code : "Enter volunteer code"}
              onChange={handleChange}
              style={inputStyles(errors.code)}
            />
          </div>
          <div className="mb-3 col-lg-6">
            <span>Volunteer Name:</span>
            <Input
              type="text"
              name="name"
              value={formData.name}
              placeholder={errors.name ? errors.name : "Enter volunteer name"}
              onChange={handleChange}
              style={inputStyles(errors.name)}
            />
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6">
            <span>Mobile:</span>
            <Input
              type="text"
              name="mobile"
              value={formData.mobile}
              placeholder={errors.mobile ? errors.mobile : "Enter mobile number"}
              onChange={handleChange}
              style={inputStyles(errors.mobile)}
            />
          </div>
          <div className="mb-3 col-lg-6">
            <span>Branch:</span>
            <Input
              type="text"
              name="branch"
              value={formData.branch}
              placeholder={errors.branch ? errors.branch : "Enter branch"}
              onChange={handleChange}
              style={inputStyles(errors.branch)}
            />
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6">
            <span>Type:</span>
            <Input
              type="select"
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={inputStyles(errors.type)}
            >
              <option value="">Select type</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
            </Input>
            {errors.type && (
              <div className="error-text" style={invalidFeedbackStyle}>{errors.type}</div>
            )}
          </div>
          <div className="mb-3 col-lg-6">
            <span>LinkedIn:</span>
            <Input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="Enter LinkedIn profile URL"
            />
          </div>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button className="btn-outline-primary" onClick={handleSave}>
          Save
        </Button>
        <Button className="btn-outline-warning" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddVolunteerForm;
