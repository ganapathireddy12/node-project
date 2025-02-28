import React, { useState, useEffect } from "react";
import axios from "axios";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Row, Col, Button, Card, CardBody, CardTitle, Label, FormGroup } from "reactstrap";
import Select from "react-select";
import './StudentForm.css'; // Custom CSS for styling

import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";


function StaffForm() {
    var { date } = useParams();
    date = JSON.parse(date)

    const [formData, setFormData] = useState({
        Name: "",
        EmployeeId: "",
        MobileNumber: "",
        Email: "",
        College: "",
        Department: "",
        BloodGroup: "",
        Gender: "",
        NumberOfTimesDonatedInCampus: "",
        NumberOfTimesDonatedOutside: "",
        EventDate: moment(date).format("DD-MM-YYYY"),
        CollegeEvent: null,
    BloodBank: null,
    Venue: null,
    Room: null,

    });



    const [collegeCode, setCollegeCode] = useState("");

    // const [eventOptions, setEventOptions] = useState([]);
    const [searchParameter, setSearchParameter] = useState("");

    const [venueData, setVenueData] = useState([]);
    const [venueOptions, setVenueOptions] = useState([]);
    // const port = import.meta.env.REACT_APP_SERVER_PORT;

    const handleEventSelect = (selectedEvent) => {
        if (selectedEvent) {
            // Map Place (array of venues) to dropdown options
            console.log(selectedEvent)

            const venues = Array.isArray(selectedEvent.venue)
                ? selectedEvent.venue.map((venue) => ({
                    value: venue,
                    label: venue,
                }))
                : [{ value: selectedEvent.venue, label: selectedEvent.venue }];

            setFormData({
                ...formData,
                EventDate: selectedEvent.date, // Set selected event date
                Venue: null, // Clear the previous venue selection
            });

            setVenueOptions(venues); // Set the venues dropdown options
        } else {
            setFormData({
                ...formData,
                EventDate: "",
                Venue: null, // Clear venue selection
            });

            setVenueOptions([]); // Reset venue options
        }
    };
    const port = import.meta.env.VITE_BACKEND_PORT;

    // useEffect(() => {
    //     const fetchVenues = async () => {
    //         try {
    //             const response = await axios.post(port + "get-venues", { date });

    //             if (response.status === 200 && response.data.Place) {
    //                 // Map the Place array to the venue options
    //                 const formattedVenues = response.data.Place.map((venue) => ({
    //                     value: venue,
    //                     label: venue,
    //                 }));

    //                 setVenueOptions(formattedVenues); // Update the venue options
    //             } else {
    //                 toast.error("No venues found for the selected date.");
    //                 setVenueOptions([]); // Reset venue options
    //             }
    //         } catch (error) {
    //             console.error("Error fetching venues:", error);
    //             toast.error("Failed to fetch venues!");
    //         }
    //     };

    //     fetchVenues();
    // }, [date]); // Runs when `date` changes


    const fetchStudentDetails = async () => {
        try {
            const response = await axios.get(`https://adityauniversity.in/latecomersbackendapi/get-Faculty-Data/${searchParameter.toUpperCase()}`);

            console.log(response.data[0]);
            if (response.data[0]) {     
                const staffData = response.data[0];
                // const selectedCollege = options.collegeOptions.find(
                //     (option) => option.value === staffData.facultyCollege
                // );
                // const selectedGender = options.genderOptions.find(
                //     (option) => option.value.toLowerCase() === staffData.facultyGender.toLowerCase()
                // );
                // console.log(selectedGender)

                setCollegeCode(staffData.facultyCollegeCode);

                setFormData({
                    ...staffData,
                    Name: staffData.facultyName,
                    EmployeeId: staffData.facultyId,
                    MobileNumber: staffData.facultyMobile,
                    Email: staffData.facultyMail,
                    Department: staffData.facultyBranch,
                    College: staffData.facultyCollege,
                    Gender: staffData.facultyGender,
                });

                console.log("Fetched and mapped data:", {
                    ...staffData,
                    // Gender: selectedGender.value || null,
                });
            } else {
                toast.error("Faculty not found!");
            }
        } catch (error) {
            console.error("Error fetching faculty details:", error);
            toast.error("Failed to fetch faculty details!");
        }
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (selectedOption, name) => {
        // console.log(selectedOption);
        setFormData({ ...formData, [name]: selectedOption.value });
    };

    const handleSubmit = () => {
        console.log("Form submitted:", formData);

        if (!formData.BloodGroup || formData.BloodGroup == "") {
            toast.error("Please select Blood Group");
            return;
        }
        // else if (!formData.Gender || formData.Gender == "" ) {
        //     toast.error("Please select Gender");
        //     return;
        // }
        else if (!formData.Venue || formData.Venue == "") {
            toast.error("Please select Venue");
            return;
        }
        else if (!formData.College || formData.College == "") {
            toast.error("Please select College");
            return;
        }

        // if (!formData.BloodGroup || !formData.Gender || !formData.College || !formData.Venue) {
        //     toast.error("Please fill all the required fields before submitting.");
        //     return;
        // }
        // else if (formData.BloodGroup == "" || formData.Gender == "" || formData.College == "" || formData.Venue == "") {
        //     toast.error("Please fill all the required fields before submitting.");
        //     return;
        // }

        const submitData = {
            ...formData,
            collegeCode: collegeCode,
            College: formData.College || "",
            BloodGroup: formData.BloodGroup || "",
            Gender: formData.Gender.trim().toUpperCase() || "",
            EventDate: date, // Send full EventDate object
            // Venue: formData.Venue?.value || "",
        };

        console.log("FormData for submission:", submitData);
        const port = import.meta.env.VITE_BACKEND_PORT;

        const submittedData = async () => {
            try {
                const response = await axios.post(port + "add-staff-data", submitData);
                console.log(response.data);

                if (response.status == 200) {
                    toast.success("Submitted successfully");
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                    // resetForm();
                }
                else if (response.status == 201) {
                    toast.success("Data submitted already");
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    // resetForm();
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                toast.error("Failed to submit the form!");
            }
        };
        submittedData();
    };

    const resetForm = () => {
        window.location.reload();

        // setFormData({
        //     Name: "",
        //     EmployeeId: "",
        //     MobileNumber: "",
        //     Email: "",
        //     College: "",
        //     Department: "",
        //     Venue: "",
        //     BloodGroup: "",
        //     Gender: "",
        //     NumberOfTimesDonatedInCampus: "",
        //     NumberOfTimesDonatedOutside: "",
        // });
    };

    const options = {
        collegeOptions: [
            { value: "ADITYA UNIVERSITY", label: "ADITYA UNIVERSITY" },
            {
              value: "ADITYA COLLEGE OF ENGINEERING & TECHNOLOGY",
              label: "ADITYA COLLEGE OF ENGINEERING & TECHNOLOGY",
            },
            {
              value: "ADITYA COLLEGE OF PHARMACY",
              label: "ADITYA COLLEGE OF PHARMACY",
            },
          ],
        genderOptions: [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" }
        ],
        bloodGroupOptions: [
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "Unknown", label: "Unknown" },
        ],
    };
    const eventOptions = {
        colleges: [
          {
            value: "Aditya University",
            label: "Aditya University",
            venues: [
              {
                value: "Cotton Bhavan, Seminar Hall",
                label: "Cotton Bhavan, Seminar Hall",
                bloodBank: "Satya Surya Blood Bank, RJY",
                room: "208",
              },
              {
                value: "Ratan Tata Bhavan, Seminar Hall",
                label: "Ratan Tata Bhavan, Seminar Hall",
                bloodBank: "Akshaya Blood Bank, KKD",
                room: "006",
              },
              {
                value: "KL Rao Bhavan, Seminar Hall",
                label: "KL Rao Bhavan, Seminar Hall",
                bloodBank: "Rotary Blood Bank, KKD",
                room: "101",
              },
              {
                value: "Bill Gates Bhavan, Seminar Hall",
                label: "Bill Gates Bhavan, Seminar Hall",
                bloodBank: "Dr. YSR Jakkampudi Rammohan Rao Blood Center, RJY",
                room: "101",
              },
            ],
          },
          {
            value: "Aditya College of Engineering & Technology",
            label: "Aditya College of Engineering & Technology",
            venues: [
              {
                value: "Visweswaraya Bhavan, Seminar Hall",
                label: "Visweswaraya Bhavan, Seminar Hall",
                bloodBank: "GGH, KKD",
                room: "011",
              },
              {
                value: "C V Raman Bhavan, Seminar Hall",
                label: "C V Raman Bhavan, Seminar Hall",
                bloodBank: "GGH, Rampachodavaram",
                room: "101",
              },
              {
                value: "Ramanujan Bhavan, Seminar Hall",
                label: "Ramanujan Bhavan, Seminar Hall",
                bloodBank: "Indian Red Cross Society, KKD",
                room: "005",
              },
              {
                value: "Newton Bhavan, Seminar Hall",
                label: "Newton Bhavan, Seminar Hall",
                bloodBank: "Sri Yuvasena Blood Bank, KKD",
                room: "201",
              },
            ],
          },
          {
            value: "Aditya College of Pharmacy",
            label: "Aditya College of Pharmacy",
            venues: [
              {
                value: "Seminar Hall",
                label: "Seminar Hall",
                bloodBank: "Dhanvantary Blood Bank, RJY",
                room: "016",
              },
            ],
          },
          {
            value: "Aditya Polytechnic College",
            label: "Aditya Polytechnic College",
            venues: [
              {
                value: "Abdul Kalam Bhavan, Seminar Hall",
                label: "Abdul Kalam Bhavan, Seminar Hall",
                bloodBank: "Rotary Blood Bank, Peddapuram",
                room: "006",
              },
            ],
          },
        ],
      };
      const handleSelectChangeEvent = (selected, field) => {
        console.log(selected);
        if (field === "CollegeEvent") {
          setFormData({
            ...formData,
            CollegeEvent: selected.value, // Store only the college name
            Venue: null, // Reset Venue, BloodBank, and Room
            BloodBank: null,
            Room: null,
          });
        } else if (field === "Venue") {
          const selectedVenue = formData.CollegeEvent // Find the selected venue details
            ? eventOptions.colleges
                .find((college) => college.value === formData.CollegeEvent)
                ?.venues.find((venue) => venue.value === selected.value)
            : null;
    
          setFormData({
            ...formData,
            Venue: selected.value, // Store only the venue name
            BloodBank: selectedVenue?.bloodBank || null,
            Room: selectedVenue?.room || null,
          });
        }
      };
    
      const collegeOptions = eventOptions.colleges.map((college) => ({
        value: college.value,
        label: college.label,
      }));
      const venueOption = formData.CollegeEvent
        ? eventOptions.colleges
            .find((college) => college.value === formData.CollegeEvent)
            ?.venues.map((venue) => ({
              value: venue.value,
              label: venue.label,
            }))
        : [];

    return (
        <>
            <Toaster />
            <div className='main-title'>
                <h3 style={{ marginBottom: "20px" }} className="heading1">Staff donor</h3>
            </div>

            <div className="student-form-container">
                <div className="suspended-student-form">
                    <Card>
                        <CardBody>
                            <AvForm>
                                <h2 className="form-title">Add staff donor</h2>
                                <Row>
                                    <Label style={{ fontWeight: "450", fontFamily: 'Poppins' }}>Enter Faculty ID</Label>
                                </Row>
                                <Row>
                                    <Col>
                                        <AvField
                                            name="rollNo"
                                            placeholder="Search by Faculty Id"
                                            type="text"
                                            errorMessage="Please enter the roll no."
                                            validate={{ required: { value: true } }}
                                            value={searchParameter}
                                            onChange={e => setSearchParameter(e.target.value)}
                                        />
                                    </Col>
                                    <Col>
                                        <Button
                                            color="primary"
                                            onClick={fetchStudentDetails}
                                            className="add-button"
                                        >
                                            Add
                                        </Button>
                                    </Col>
                                </Row>
                            </AvForm>
                        </CardBody>
                    </Card>
                </div>
                <div className="student-blood-donation-form" style={{ padding: "20px" }}>
                    <Card>
                        <CardBody>
                            <center>
                                <CardTitle className="form-title" style={{
                                    textAlign: 'center',
                                    fontSize: '25px',
                                    fontWeight: 'bolder',
                                }} >Staff Blood Donation Form</CardTitle></center>
                            <AvForm onValidSubmit={handleSubmit}>
                                <Row>
                                    <Col>
                                        <AvField
                                            name="Name"
                                            label="Name"
                                            value={formData.Name}
                                            placeholder="Enter Name"
                                            onChange={handleInputChange}
                                            validate={{
                                                required: { value: true },
                                                pattern: {
                                                    value: "^[a-zA-Z .'-]+$",
                                                    errorMessage: "Only letters, spaces, periods, hyphens, and apostrophes are allowed"
                                                },
                                            }}
                                        />

                                    </Col>
                                    <Col>
                                        <AvField
                                            name="EmployeeId"
                                            label="Employee ID"
                                            value={formData.EmployeeId}
                                            placeholder="Enter Employee ID"
                                            onChange={handleInputChange}
                                            validate={{ required: { value: true } }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AvField
                                            name="MobileNumber"
                                            label="Mobile Number"
                                            value={formData.MobileNumber}
                                            placeholder="Enter Mobile Number"
                                            type="number"
                                            onChange={handleInputChange}
                                            validate={{
                                                required: { value: true },
                                                pattern: { value: "^[0-9]{10}$", errorMessage: "Enter a valid 10-digit number" },
                                            }}
                                        />
                                    </Col>
                                    <Col>
                                        <AvField
                                            name="Email"
                                            label="Email"
                                            value={formData.Email}
                                            placeholder="Enter Email"
                                            type="string"
                                            onChange={handleInputChange}
                                            validate={{ required: { value: true } }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            {/* <Label>College</Label> */}
                                            <AvField
                                                name="College"
                                                label="College"
                                                options={options.collegeOptions}
                                                placeholder="Select College"
                                                value={formData.College}
                                                onChange={(selected) => handleSelectChange(selected, "College")}
                                            />
                                        </FormGroup>
                                        {/* <FormGroup>
                                        <AvField
                                            name="Event Date"
                                            label="Event Date"
                                            placeholder="Enter Section"
                                            onChange={handleEventSelect}
                                            value={moment(date).format("DD-MM-YYYY")}
                                            validate={{ required: { value: true } }}
                                            readOnly

                                        />
                                    </FormGroup> */}
                                    </Col>
                                    <Col>
                                        <AvField
                                            name="Department"
                                            label="Department"
                                            value={formData.Department}
                                            placeholder="Enter Department"
                                            onChange={handleInputChange}
                                            validate={{ required: { value: true } }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label>Blood Group</Label>
                                            <Select
                                                options={options.bloodGroupOptions}
                                                placeholder="Select Blood Group"
                                                onChange={selected => handleSelectChange(selected, "BloodGroup")}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        {/* <FormGroup>
                                            <Label>Gender</Label>
                                            <Select
                                                options={options.genderOptions}
                                                placeholder="Select Gender"
                                                value={formData.Gender}
                                                onChange={(selected) => handleSelectChange(selected, "Gender")}
                                            />
                                        </FormGroup> */}
                                        <AvField
                                            name="Gender"
                                            label="Gender"
                                            value={formData.Gender}
                                            placeholder="Select Gender"
                                            onChange={handleInputChange}
                                            validate={{ required: { value: true } }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AvField
                                            name="NumberOfTimesDonatedInCampus"
                                            label="Times Donated In Campus"
                                            value={formData.NumberOfTimesDonatedInCampus}
                                            placeholder="Enter Count"
                                            type="number"
                                            onChange={handleInputChange}
                                            validate={{ required: { value: true } }}
                                        />
                                    </Col>
                                    <Col>
                                        <AvField
                                            name="NumberOfTimesDonatedOutside"
                                            label="Times Donated Outside"
                                            value={formData.NumberOfTimesDonatedOutside}
                                            placeholder="Enter Count"
                                            type="number"
                                            onChange={handleInputChange}
                                            validate={{ required: { value: true } }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <AvField
                                                name="Event Date"
                                                label="Event Date"
                                                // value={date}
                                                placeholder="Enter Section"
                                                onChange={handleEventSelect}
                                                value={moment(date).format("DD-MM-YYYY")}
                                                validate={{ required: { value: true } }}
                                                readOnly

                                            />
                                        </FormGroup>


                                    </Col>

                                </Row>
                                <Row>
                  <Col>
                    <hr style={{ border: "2px solid gray" }} />
                  </Col>
                </Row>
                <CardTitle
                  className="form-title"
                  style={{
                    textAlign: "center",
                    fontSize: "25px",
                    fontWeight: "bolder",
                  }}
                >
                  Event Details
                </CardTitle>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>College</Label>
                      <Select
                        options={collegeOptions} // Dropdown options for colleges
                        placeholder="Select College"
                        value={collegeOptions.find(
                          (college) => college.value === formData.CollegeEvent
                        )} // Match selected college by its value
                        onChange={(selected) =>
                          handleSelectChangeEvent(selected, "CollegeEvent")
                        }
                        isClearable
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Venue</Label>
                      <Select
                        options={venueOption} // Dropdown options for venues based on selected college
                        placeholder="Select Venue"
                        value={venueOption.find(
                          (venue) => venue.value === formData.Venue
                        )} // Match selected venue by its value
                        onChange={(selected) =>
                          handleSelectChangeEvent(selected, "Venue")
                        }
                        isClearable
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Name of the Blood Bank</Label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.BloodBank || ""} 
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Room No</Label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.Room || ""} 
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                </Row>
                                <FormGroup className="form-buttons">
                                    <Button
                                        color="success"
                                        type="submit"
                                        style={{ marginRight: "10px", backgroundColor: "#33f474", border: "1px solid gray" }}
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        color="secondary"
                                        type="reset"
                                        onClick={resetForm}
                                    >
                                        Reset
                                    </Button>
                                </FormGroup>
                            </AvForm>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default StaffForm;
