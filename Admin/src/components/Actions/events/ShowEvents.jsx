import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "./Eventcard";
import ConfirmDelete from "./ConfirmDelete";
import { Row } from "reactstrap";
import "./ShowEvents.css";
import AddEventForm from "./AddEventForm";

const ShowEvents = () => {
  // const port = import.meta.env.REACT_APP_SERVER_PORT;
  const [eventsData, setEventsData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Fetch event data
  const port = import.meta.env.VITE_BACKEND_PORT;

  const fetchEvents = () => {
    axios
      .get(port + "get-events")
      .then((response) => {
        setEventsData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  // // const port = import.meta.env.REACT_APP_SERVER_PORT;

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteClick = (eventName) => {
    setSelectedEvent(eventName); // Set the event to delete
    setModalOpen(true);          // Open the confirmation modal
  };
  // const port = import.meta.env.VITE_BACKEND_PORT;


  const handleDeleteConfirm = async () => {
    setModalOpen(false); // Close the confirmation modal
    try {
      await axios.post(port + `delete-event`,{"EventId": selectedEvent});
      console.log(`Event ${selectedEvent} deleted successfully.`);
      fetchEvents(); // Refresh the events list after deletion
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleAddEventSuccess = () => {
    setAddModalOpen(false);
    fetchEvents(); // Refresh the event list after adding a new event
  };

  return (
    <>
    <div className='main-title'>
        <h3 style={{ marginBottom: "20px" }} className="heading1">Events</h3>
      </div>
      <Row className="justify-content-center mt-2" onClick={() => setAddModalOpen(true)}>
        <button className="add-event-btn btn w-25 btn-primary addVolunteer">Add New Event</button>
      </Row>

      <AddEventForm 
        isOpen={addModalOpen} 
        toggle={() => setAddModalOpen(false)} 
        onSuccess={handleAddEventSuccess} 
      />

      <div className="events-container">
        {/* {console.log(eventsData)} */}
        {eventsData.length > 0 ? (
          eventsData.map((event, index) => (
            
            <EventCard
              key={index}
              name={event.EventName}
              date={event.Date}
              venue={event.Place}
              image={event.filename}
              id = {event._id}
              onDelete={() => handleDeleteClick(event._id)} // Pass onDelete function
            />
          ))

        ) : (
          <p>No events found</p>
        )}
        {selectedEvent && (
          <ConfirmDelete
            isOpen={modalOpen}
            toggle={() => setModalOpen(false)}
            onDelete={handleDeleteConfirm}
            eventName={selectedEvent}
          />
        )}
      </div>
    </>
  );
};

export default ShowEvents;
