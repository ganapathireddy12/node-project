import React, { useState, useEffect, useRef } from "react";
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

const AddEventForm = ({ isOpen, toggle, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    colleges: [
      {
        name: "",
        bloodBanks: [
          {
            nameOfTheBloodBank: "",
            Venue: "",
            RoomNo: "",
          },
        ],
      },
    ],
    date: "",
    image: null,
  });
  const [dispImage, setDispImage] = useState("");
  const [errors, setErrors] = useState({});
  const imageRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      clearForm();
      clearErrors();
    }
  }, [isOpen]);

  const handleChange = (
    e,
    collegeIndex = null,
    campIndex = null,
    field = ""
  ) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setDispImage(fileReader.result);
      };
      fileReader.readAsDataURL(files[0]);
      setErrors({ ...errors, image: "" });
    } else if (collegeIndex !== null) {
      const updatedColleges = [...formData.colleges];

      if (campIndex !== null && field) {
        updatedColleges[collegeIndex].bloodBanks[campIndex][field] = value;
      } else if (field === "name") {
        updatedColleges[collegeIndex].name = value;
      }

      setFormData({ ...formData, colleges: updatedColleges });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAddCollege = () => {
    setFormData({
      ...formData,
      colleges: [
        ...formData.colleges,
        {
          name: "",
          bloodBanks: [
            {
              nameOfTheBloodBank: "",
              Venue: "",
              RoomNo: "",
            },
          ],
        },
      ],
    });
  };

  const handleAddBloodBank = (collegeIndex) => {
    const updatedColleges = [...formData.colleges];
    updatedColleges[collegeIndex].bloodBanks.push({
      nameOfTheBloodBank: "",
      Venue: "",
      RoomNo: "",
    });
    setFormData({ ...formData, colleges: updatedColleges });
  };

  const handleRemoveBloodBank = (collegeIndex, campIndex) => {
    const updatedColleges = [...formData.colleges];
    if (updatedColleges[collegeIndex].bloodBanks.length > 1) {
      updatedColleges[collegeIndex].bloodBanks.splice(campIndex, 1);
      setFormData({ ...formData, colleges: updatedColleges });
    }
  };

  const handleRemoveCollege = (collegeIndex) => {
    const updatedColleges = [...formData.colleges];
    if (updatedColleges.length > 1) {
      updatedColleges.splice(collegeIndex, 1);
      setFormData({ ...formData, colleges: updatedColleges });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.image) newErrors.image = "An image is required";

    formData.colleges.forEach((college, collegeIndex) => {
      if (!college.name.trim()) {
        newErrors[`college_${collegeIndex}`] = "College name is required";
      }
      college.bloodBanks.forEach((camp, campIndex) => {
        if (
          !camp.nameOfTheBloodBank.trim() ||
          !camp.Venue.trim() ||
          !camp.RoomNo.trim()
        ) {
          newErrors[`camp_${collegeIndex}_${campIndex}`] =
            "All blood camp fields are required";
        }
      });
    });

    return newErrors;
  };

  const handleSave = async (event) => {
    event.preventDefault();

    // Log the entered data to the console
    console.log("Form Data Submitted:", formData);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const port = import.meta.env.VITE_BACKEND_PORT;

    const formDataToSend = new FormData();
    formDataToSend.append("image", formData.image);
    formDataToSend.append("EventName", formData.name);
    formDataToSend.append("Date", formData.date);
    formDataToSend.append("Colleges", JSON.stringify(formData.colleges));

    console.log(formData);

    try {
      const result = await axios.post(port + "add-event", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Explicitly define the header
        },
      });
      clearForm();
      toggle();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error uploading event:", error);
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      colleges: [
        {
          name: "",
          bloodBanks: [
            {
              nameOfTheBloodBank: "",
              Venue: "",
              RoomNo: "",
            },
          ],
        },
      ],
      date: "",
      image: null,
    });
    setDispImage("");
  };

  const clearErrors = () => setErrors({});

  const defaultImage = "/Dummy.png";

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add Event Details</ModalHeader>
      <form onSubmit={handleSave}>
        <ModalBody>
          <Row className="details_group">
            <div className="mb-3 image-div" style={{ position: "relative" }}>
              <img
                src={dispImage || defaultImage}
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
                className="image-div"
                accept="image/*"
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
            </div>
            {errors.image && (
              <div className="text-danger" style={{ marginTop: "8px" }}>
                {errors.image}
              </div>
            )}
          </Row>

          <Row className="details_group">
            <div className="mb-3 col-lg-12">
              <span>Event Name:</span>
              <Input
                type="text"
                name="name"
                value={formData.name}
                placeholder={errors.name || "Enter event name"}
                onChange={handleChange}
                className={errors.name ? "is-invalid" : ""}
              />
              {errors.name && (
                <div className="text-danger" style={{ marginTop: "8px" }}>
                  {errors.name}
                </div>
              )}
            </div>
          </Row>

          <Row className="details_group">
            {formData.colleges.map((college, collegeIndex) => (
              <div
                key={collegeIndex}
                className="mb-3 col-lg-12 addEventCollegeBlock"
              >
                <span style={{ textDecoration: "underline" }}>
                  College Name:
                </span>
                <Input
                  style={{ marginTop: "4px" }}
                  type="text"
                  value={college.name}
                  placeholder={
                    errors[`college_${collegeIndex}`] || "College Name"
                  }
                  onChange={(e) => handleChange(e, collegeIndex, null, "name")}
                  className={
                    errors[`college_${collegeIndex}`] ? "is-invalid" : ""
                  }
                />
                {errors[`college_${collegeIndex}`] && (
                  <div className="text-danger" style={{ marginTop: "8px" }}>
                    {errors[`college_${collegeIndex}`]}
                  </div>
                )}

                {college.bloodBanks.map((camp, campIndex) => (
                  <div key={campIndex} className="mb-3">
                    <span style={{ paddingLeft: "5%" }}>
                      Blood Bank {campIndex + 1}:
                    </span>
                    <div className="d-flex gap-2">
                      <div className="adminCollege">
                        <Input
                          type="text"
                          value={camp.nameOfTheBloodBank}
                          placeholder={
                            errors[`camp_${collegeIndex}_${campIndex}`] ||
                            "Blood Bank Name"
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              collegeIndex,
                              campIndex,
                              "nameOfTheBloodBank"
                            )
                          }
                          className={
                            errors[`camp_${collegeIndex}_${campIndex}`]
                              ? "is-invalid"
                              : ""
                          }
                        />
                        <Input
                          type="text"
                          value={camp.Venue}
                          placeholder="Venue"
                          onChange={(e) =>
                            handleChange(e, collegeIndex, campIndex, "Venue")
                          }
                        />
                        <Input
                          type="text"
                          value={camp.RoomNo}
                          placeholder="Room No"
                          onChange={(e) =>
                            handleChange(e, collegeIndex, campIndex, "RoomNo")
                          }
                        />
                      </div>
                      {college.bloodBanks.length > 1 && (
                        <Button
                          color="link"
                          size="sm"
                          className="text-danger"
                          onClick={() =>
                            handleRemoveBloodBank(collegeIndex, campIndex)
                          }
                        >
                          x
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  color="link"
                  size="sm"
                  className="mt-2 text-muted"
                  onClick={() => handleAddBloodBank(collegeIndex)}
                >
                  + Add Another Blood Camp
                </Button>
                {formData.colleges.length > 1 && (
                  <Button
                    color="link"
                    size="sm"
                    className="text-danger mt-2"
                    onClick={() => handleRemoveCollege(collegeIndex)}
                  >
                    Remove College
                  </Button>
                )}
              </div>
            ))}
            <Button
              color="link"
              size="sm"
              className="mt-2 text-muted"
              onClick={handleAddCollege}
            >
              + Add Another College
            </Button>
          </Row>

          <Row className="details_group">
            <div className="mb-3 col-lg-12">
              <span>Date:</span>
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
            </div>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" className="btn-outline-primary">
            Save
          </Button>
          <Button
            type="button"
            className="btn-outline-warning"
            onClick={toggle}
          >
            Close
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AddEventForm;
