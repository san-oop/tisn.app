import React, { useState, useEffect, createRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import { getMessages, getFriendship, postMessage } from '../../logic/api';
import { buildValidationErrorsObject, decodeText } from '../../logic/utils';

import { useUser } from '../UserProvider/UserProvider';

import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Chats = ({ match }) => {
  const style = Style();
  const user = useUser();

  const [friendship, setFriendship] = useState(null);
  const [userToDisplay, setUserToDisplay] = useState(null);
  const [messages, setMessages] = useState(null);
  const [updateMessages, setUpdateMessages] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const id = match.params.friendshipId;
  useEffect(() => {
    setUserToDisplay(null);
    setMessages(null);
    if (user && id) {
      setLoading(true);
      setError(null);
      getFriendship(user._id, id)
        .then((data) => {
          setFriendship(data.friendship);
          setUpdateMessages(true);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [user, id]);

  useEffect(() => {
    if (user && friendship) {
      setLoading(true);
      setUserToDisplay(
        friendship.requestant._id === user._id
          ? friendship.receivant
          : friendship.requestant
      );
      setLoading(false);
    }
  }, [user, friendship]);

  useEffect(() => {
    if (user && id && updateMessages) {
      setLoading(true);
      setError(null);
      getMessages(user._id, id)
        .then((data) => setMessages(data.messages))
        .catch((error) => setError(error))
        .finally(() => {
          setUpdateMessages(false);
          setLoading(false);
        });
    }
  }, [user, id, updateMessages]);

  const cardContentRef = createRef();
  useEffect(() => {
    if (cardContentRef && cardContentRef.current) {
      cardContentRef.current.scrollTop = cardContentRef.current.scrollHeight;
    }
  }, [cardContentRef]);

  const handleClick = () => {
    setLoading(true);
    setError(null);
    setValidationErrors({});

    const message = {
      friendship: id,
      user: user._id,
      content,
    };

    postMessage(user._id, id, message)
      .then((data) => {
        if (data.errors) {
          setError('The form contains errors');
          setValidationErrors(buildValidationErrorsObject(data.errors));
          setLoading(false);
        } else {
          setUpdateMessages(true);
          setContent('');
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      {userToDisplay && (
        <div className={style.root}>
          <Card className={style.grow}>
            <CardActionArea
              component={Link}
              to={`/users/${userToDisplay._id}`}
              color="inherit"
              underline="none"
            >
              <CardHeader
                avatar={
                  <Avatar
                    src={userToDisplay.avatar}
                    alt={`${userToDisplay.name}'s avatar`}
                  >
                    {userToDisplay.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={userToDisplay.name}
                titleTypographyProps={{ variant: 'h5', component: 'h3' }}
              />
            </CardActionArea>
            <CardContent
              ref={cardContentRef}
              className={style.messagesCardContent}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={1}
              >
                {messages &&
                  messages.length > 0 &&
                  messages.map((message) => (
                    <Grid item key={message._id} className={style.fullWidth}>
                      <Typography
                        className={`${style.preLine} ${style.message} ${
                          message.user === user._id
                            ? style.messageSent
                            : style.messageReceived
                        }`}
                        variant="body1"
                      >
                        {decodeText(message.content)}
                      </Typography>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
            <CardActions>
              <TextField
                multiline
                rowsMax={3}
                className={`${style.fullWidth} ${style.center}`}
                variant="outlined"
                placeholder="Write a message..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      color="primary"
                      onClick={() => handleClick()}
                      disabled={!content || loading}
                    >
                      <SendIcon />
                    </IconButton>
                  ),
                }}
                error={!!validationErrors.content}
                helperText={validationErrors.content}
              />
            </CardActions>
          </Card>
        </div>
      )}
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Chats;