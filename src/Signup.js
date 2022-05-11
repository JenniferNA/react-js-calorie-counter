import React, { useState } from "react";
import { auth, db } from "./base";
import "./Signup.css";
import {Paper, Stack, Box, Button, Typography, Input} from '@mui/material/';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    function onRegister() {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          set(ref(db, "users/" + userCredential.user.uid), {
            firstName: firstName,
            lastName: lastName,
            email: email,
          });
        })
        .catch((error) => console.log(error));
      navigate(process.env.PUBLIC_URL + '/');
    }
    onRegister();
  };

  return (

    <Box className="signup-page">
      <Paper className='signup-form' elevation={2}>
          <Stack spacing={2}>
            <Typography variant='h5'>Sign Up</Typography>
            <Input
              placeholder="First Name"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}></Input>
            <Input
              placeholder="Last Name"
              type="text"
              onChange={(e) => setLastName(e.target.value)}></Input>
            <Input
              placeholder="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}></Input>
            <Input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}></Input>
            
            <Button onClick={handleSubmit}>Sign Up</Button>
          </Stack>
      </Paper>
    </Box>
  );
};

export default SignUp;