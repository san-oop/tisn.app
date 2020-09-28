import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useUser } from '../UserProvider/UserProvider';

import Footer from '../Footer/Footer';

import Style from '../Style/Style';

const About = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const style = Style();
  const user = useUser();

  const formatSection = (section, invertOrder) => {
    const { title, image, paragraph, button } = section;

    const getGridItem = (key, content) => {
      return (
        <Grid className={style.center} item key={key} sm={6} xs={12}>
          {content}
        </Grid>
      );
    };

    const titleGridItem = getGridItem(
      image,
      <div>
        <img style={{ width: '65%' }} src={image} alt={title} />
      </div>
    );

    const contentGridItem = getGridItem(
      button.href,
      <Fragment>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography gutterBottom variant="body1">
          {paragraph}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          {...Object.assign(
            {},
            button.href.startsWith('/')
              ? { onClick: () => history.push(button.href) }
              : {
                  href: button.href,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
          )}
        >
          {button.content}
        </Button>
      </Fragment>
    );

    if (invertOrder && matches) {
      return [contentGridItem, titleGridItem];
    } else {
      return [titleGridItem, contentGridItem];
    }
  };

  const sections = [
    {
      title: t('about.interestsTitle'),
      paragraph: t('about.interestsParagraph'),
      image: require(`../../assets/images/interests.svg`),
      button: {
        href: '/interests',
        content: t('about.interestsButton'),
      },
    },
    {
      title: t('about.eventsTitle'),
      paragraph: t('about.eventsParagraph'),
      image: require(`../../assets/images/events.svg`),
      button: { href: '/events', content: t('about.eventsButton') },
    },
    {
      title: t('about.usersTitle'),
      paragraph: t('about.usersParagraph'),
      image: require(`../../assets/images/users.svg`),
      button: { href: '/users', content: t('about.usersButton') },
    },
    {
      title: t('about.openSourceTitle'),
      paragraph: t('about.openSourceParagraph'),
      image: require(`../../assets/images/openSource.svg`),
      button: {
        href: 'https://github.com/Tisn/tisn.app',
        content: t('about.openSourceButton'),
      },
    },
  ];

  return (
    <div className={style.root}>
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item className={style.center} xs={12}>
          <Typography gutterBottom variant="h2">
            {t('about.title')}
          </Typography>
          <Typography gutterBottom variant="body1">
            {t('about.overview')}
          </Typography>
        </Grid>
        <Grid item className={style.center} xs={12}>
          <Typography gutterBottom variant="body1">
            {t('about.sections')}
          </Typography>
        </Grid>
        {sections.map((section, index) =>
          formatSection(section, index % 2 !== 0)
        )}
        {!user && (
          <Grid
            item
            style={{ marginTop: '8px' }}
            className={style.center}
            xs={12}
          >
            <Typography gutterBottom variant="body1">
              {t('about.signUp')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push('/sign-up')}
            >
              {t('about.signUpButton')}
            </Button>
          </Grid>
        )}
        <Grid item className={style.center} xs={12}>
          <Typography gutterBottom variant="body1">
            {t('about.keepInTouch')}
          </Typography>
          <Footer />
        </Grid>
      </Grid>
    </div>
  );
};

export default About;
