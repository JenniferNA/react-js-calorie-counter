import React, { useState, useEffect, useContext } from 'react';
import { auth, db } from "./base";
import { signOut } from "firebase/auth";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import {Button, AppBar, Stack, Toolbar, Typography} from '@mui/material/';
import Box from '@mui/system/Box';
import './Home.css';

const Navigation = () =>{

    const navigate = useNavigate();
    //User Info
    const { currentUser } = useContext(AuthContext);
    const [username, setUsername] = useState("");

    //navigate to login
    const clickLogin = () => {
    if (currentUser) {
        signOut(auth);
    } else {
        navigate("/login");
    }
    };

    //navigate to signup
    const clickSignup = () => {
    navigate("/signup");
    };

    //navigate home
    const clickHome = () => {
        navigate(process.env.PUBLIC_URL + '/');
    };

    //will update user info
    useEffect(() => {
    if (currentUser) {
        const starCountRef = ref(db, "users/" + currentUser.uid);
        onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
            var data = snapshot.val();
            setUsername(data.firstName + " " + data.lastName);
        }
        });
    }
    }, [currentUser]);

    return(
        <AppBar position="static">
                <Box sx={{ flexGrow: 1 }}>
                <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }} onClick={clickHome}>Calorie Counter</Typography>
                    <Stack direction="row" spacing={3}>
                        {currentUser && <Typography alignSelf="center">Welcome, {username}</Typography>}
                        <Button id="login-btn" variant="text" color="primary" component="div" style={{"backgroundColor":"#60a5f7", "color":"white"}} onClick={clickLogin}>
                        {currentUser ? "Log Out" : "Login"}
                        </Button>
                        {!currentUser && <Button id="signup-btn" variant="text" color="primary" component="div" style={{"backgroundColor":"#60a5f7", "color":"white"}} onClick={clickSignup}>Sign Up</Button>}
                    </Stack>
                </Toolbar>
                </Box>
        </AppBar>
    );
}
export default Navigation;