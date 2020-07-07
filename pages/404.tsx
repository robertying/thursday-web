import { Container, Typography, Paper, Grid, Button } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { NextSeo } from "next-seo";
import Layout from "components/Layout";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: "20vh auto",
    },
    paper: {
      padding: theme.spacing(4),
      "& > *": {
        margin: theme.spacing(2),
      },
    },
  })
);

const NotFoundPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Layout page="others">
      <NextSeo title="404" />
      <Grid
        className={classes.root}
        container
        component={Container}
        justify="center"
        alignItems="center"
        maxWidth="md"
      >
        <Paper className={classes.paper}>
          <Typography variant="h3">404 未找到该页面</Typography>
          <Typography variant="body1" gutterBottom>
            您请求的页面不存在。
          </Typography>
          <Link href="/">
            <a>
              <Button color="primary">返回主页</Button>
            </a>
          </Link>
        </Paper>
      </Grid>
    </Layout>
  );
};

export default NotFoundPage;
