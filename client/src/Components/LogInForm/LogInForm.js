import React, { useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { logIn, setUserSession } from '../../logic/auth';

import Style from '../Style/Style';

const LogInForm = () => {
  const history = useHistory();
  const style = Style();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = () => {
    setLoading(true);
    logIn({ email, password })
      .then((data) => {
        setUserSession(data.user);
        history.push('/');
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <Box p={1}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h1">Log in</Typography>
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              label="Email"
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClick()}
              disabled={loading || !email || !password}
            >
              Log in
            </Button>
          </Grid>
          <Grid item>
            <Link href="/sign-up">Sign up</Link>
            {' | '}
            <Link href="/">Home</Link>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default LogInForm;
