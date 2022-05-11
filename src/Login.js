import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";
import {Paper, Stack, Box, Button, Typography, Input} from '@mui/material/';
import { useNavigate } from "react-router-dom";
import { auth } from "./base";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    function onRegister() {
      signInWithEmailAndPassword(auth, email, password).catch((error) =>
        console.log(error)
      );
      navigate(process.env.PUBLIC_URL + '/');
    }
    onRegister();
  };

  return (
    <Box className="login-page">
      <Paper className='login-form' elevation={2}>
          <Stack spacing={2}>
            <Typography variant='h5'>Login</Typography>
            <Input
              placeholder="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}></Input>
            <Input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}></Input>
            
            <Button onClick={handleSubmit}>Login</Button>
          </Stack>
      </Paper>
    </Box>
  );
};

export default Login;