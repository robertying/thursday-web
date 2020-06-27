import { Grid, Typography, Container } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import NavigationBar, { Page } from "./NavigationBar";

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      margin: `${theme.spacing(4)}px auto`,
    },
    toolbar: theme.mixins.toolbar,
  })
);

export interface LayoutProps {
  children: React.ReactNode;
  page: Page;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, page, title }) => {
  const classes = useStyles();

  return (
    <>
      <NavigationBar page={page} title={title} />
      <div className={classes.toolbar} />
      {children}
      <Grid
        className={classes.main}
        container
        component={Container}
        maxWidth="md"
        direction="row"
        justify="center"
        spacing={2}
      >
        <Grid item xs>
          <Typography variant="caption">© 2020 Thursday</Typography>
        </Grid>
      </Grid>
      <div className={classes.toolbar} />
    </>
  );
};

export default Layout;
