import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import moment from "moment";


// import EventImage from  '../../assets/EventImage.jpg'

export default function EventCard(props) {
  // const port = import.meta.env.REACT_APP_SERVER_PORT;
  // {console.log(props)}
  const { name, venue, image, date} = props;
  const ActualDate =   moment(date).format('DD-MM-YYYY');
  const port = import.meta.env.VITE_BACKEND_PORT;


  const finalPath = port + "Events/" + image;

  return (
    <>
      <Card
        sx={{
          width: 325,
          borderRadius: 2,
          boxShadow: 3,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 5,
          },
          minHeight: "220px",

          alignContent: "center"
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            // image={EventImage}
            image="/cardImage.jpg"
            alt={name}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary" style={{display: "flex", alignItems:"center", flexDirection:"column"}}>
              <p style={{alignSelf:"flex-start", marginLeft:"50px", fontFamily:"sans-serif", color:"black"}}>{"EventDate:  " }
             
                {ActualDate}
                </p>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
