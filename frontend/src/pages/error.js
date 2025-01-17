import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for does not exist or you do not have access to
        it.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoBack}>
        Go Back to Home
      </Button>
    </Container>
  );
};

export default Error;
