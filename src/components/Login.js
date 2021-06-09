import React, { useState, useContext } from "react";
import UserContext from "../context/UserContext";
import { FormControl, TextField, Button } from "@material-ui/core";

let PASSWORD = process.env.REACT_APP_PASSWORD;

const Login = () => {
    const { user, setUser } = useContext(UserContext);
    const [status, setStatus] = useState();
    const [username, setUsername] = useState(); // TODO: remove
    const [password, setPassword] = useState(); // TODO: remove
    const handleSubmit = async (event) => {
        setStatus("");
        event.preventDefault();
        if (
            (username.toLowerCase() === "mediaone" ||
                username.toLowerCase() === "tom" ||
                username.toLowerCase() === "sales" ||
                username.toLowerCase() === "seo") &&
            password === PASSWORD
        ) {
            setStatus("");
            await setUser(username);
            await sessionStorage.setItem("user", username);
        } else {
            setStatus("Invalid Username or Password ");
        }
    };

    const handleLogout = async (event) => {
        event.preventDefault();
        await setUser(null);
        await sessionStorage.clear();
    };

    return (
        <div className='container'>
            {user ? (
                <>
                    <h1>
                        Greetings {user.charAt(0).toUpperCase() + user.slice(1)}
                    </h1>
                    <Button
                        variant='contained'
                        color='secondary'
                        onClick={(e) => {
                            handleLogout(e);
                        }}
                    >
                        Log out
                    </Button>
                </>
            ) : (
                <div>
                    <div>
                        <h1>Login</h1>
                        <form
                            onSubmit={(event) => {
                                handleSubmit(event);
                            }}
                        >
                            <FormControl fullWidth>
                                <TextField
                                    type='text'
                                    margin='normal'
                                    label='Username'
                                    fullWidth
                                    value={username || ""}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                    required
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    type='password'
                                    margin='normal'
                                    label='Password'
                                    fullWidth
                                    value={password || ""}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    required
                                />
                            </FormControl>
                            <div>
                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='secondary'
                                >
                                    Login
                                </Button>
                            </div>
                            <p>{status}</p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
