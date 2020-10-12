import { Grid, Typography, Container } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import NavigationBar, { NavigationBarProps } from "./NavigationBar";

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      margin: `${theme.spacing(4)}px auto`,
    },
    toolbar: theme.mixins.toolbar,
  })
);

export interface LayoutProps extends NavigationBarProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, ...restProps }) => {
  const classes = useStyles();

  return (
    <>
      <NavigationBar {...restProps} />
      <div className={classes.toolbar} />
      {children}
      <Grid
        className={classes.main}
        container
        component={Container}
        maxWidth="md"
        direction="row"
        justify="center"
      >
        <Grid container item xs direction="column">
          <Typography variant="caption">
            用户生成内容的使用依据{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
              target="_blank"
              rel="noreferrer noopener"
            >
              CC BY-NC-SA 4.0
            </a>{" "}
            知识共享许可协议进行。
          </Typography>
        </Grid>
      </Grid>
      <div className={classes.toolbar} />
    </>
  );
};

export default Layout;
