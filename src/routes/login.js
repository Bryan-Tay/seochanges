import {
  Button,
  Container,
  CssBaseline,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: theme.spacing(16),
  },
  title: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();
  const { login } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ username, password }) => {
    await login(username, password);
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.paper}>
      <CssBaseline />
      <Typography component="h4" variant="h6">
        MediaOne
      </Typography>
      <Typography component="h1" variant="h3" className={classes.title}>
        Sign in
      </Typography>
      <form
        noValidate
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          required
          autoFocus
          fullWidth
          id="username"
          name="username"
          margin="normal"
          label="Username"
          variant="outlined"
          autoComplete="username"
          {...register("username", { required: true })}
        />
        <TextField
          required
          fullWidth
          id="password"
          type="password"
          name="password"
          margin="normal"
          label="Password"
          variant="outlined"
          autoComplete="password"
          {...register("password", { required: true })}
        />
        <Button
          fullWidth
          type="submit"
          color="secondary"
          variant="contained"
          className={classes.submit}
        >
          Sign In
        </Button>
      </form>
    </Container>
  );
};

export default Login;
