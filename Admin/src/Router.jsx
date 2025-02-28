import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home/Home";
import DonorData from "./components/DonorData/DonorData";
import Dashboard from "./components/Dashboard";
import ShowGallery from "./components/Actions/gallery/ShowGallery";
import ShowEvents from "./components/Actions/events/ShowEvents";
import ShowVolunteers from "./components/Actions/volunteers/ShowVolunteers";
import StudentForm from "./components/Forms/StudentForm";
import StaffForm from "./components/Forms/StaffForm";
import GuestForm from "./components/Forms/GuestForm";
import LoginForm from "./components/LoginPage/Login";

import ShowDonorCards from './components/DonorData/ShowDonorCards'
import ShowFormEvents from './components/Forms/ShowFormEvents';
import ShowDonatedData from './components/DonatedData/ShowDonorCards';
import DonatedData from './components/DonatedData/DonorData'

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor-forms/:donor"
        element={
          <ProtectedRoute>
            <ShowFormEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor-data"
        element={
          <ProtectedRoute>
            <ShowDonorCards />
          </ProtectedRoute>
        }
      />


      <Route
        path="/donor-details-each/:date/:eventName"
        element={
          <ProtectedRoute>
            <DonorData />
          </ProtectedRoute>
        }
      />

<Route
        path="/donated-data"
        element={
          <ProtectedRoute>
            <ShowDonatedData />
          </ProtectedRoute>
        }
      />


      <Route
        path="/donated-details-each/:date/:eventName"
        element={
          <ProtectedRoute>
            <DonatedData />
          </ProtectedRoute>
        }
      />


      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <ShowGallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event"
        element={
          <ProtectedRoute>
            <ShowEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute>
            <ShowVolunteers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/:date/"
        element={
          <ProtectedRoute>
            <StudentForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/:date/"
        element={
          <ProtectedRoute>
            <StaffForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guest/:date/"
        element={
          <ProtectedRoute>
            <GuestForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
