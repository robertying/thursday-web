import React, { useState } from "react";
import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Post from "components/Post";
import Layout from "components/Layout";
import FloatingActions from "components/FloatingActions";
import CommentCard from "components/CommentCard";
import { useQuery } from "@apollo/client";
import { GetPost, GetPostVariables } from "apis/types";
import { GET_POST } from "apis/post";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import { initializeApollo } from "apis/client";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: "auto",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  })
);

const PostPage: React.FC = (props) => {
  const classes = useStyles();

  const router = useRouter();
  const { postId } = router.query;

  const { data } = useQuery<GetPost, GetPostVariables>(GET_POST, {
    variables: {
      id: parseInt(postId as string, 10),
    },
  });

  const post = data?.post?.[0];

  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const handleModalClose = () => {
    setCommentModalVisible(false);
  };

  return (
    <Layout page="post" title={post?.topic.name}>
      <Grid
        className={classes.root}
        container
        component={Container}
        direction="column"
        maxWidth="md"
        spacing={2}
      >
        <Grid item>{post && <Post {...post} />} </Grid>
        {/* <Grid item>
          <Post onCommentButtonClick={() => setCommentModalVisible(true)} />
        </Grid>
        <Grid item>
          <Post />
        </Grid>
        <Grid item>
          <Post />
        </Grid> */}
      </Grid>
      <Dialog
        open={commentModalVisible}
        onClose={handleModalClose}
        scroll="body"
        aria-labelledby="comment-dialog-title"
        aria-describedby="comment-dialog-description"
      >
        <DialogTitle id="comment-dialog-title">评论</DialogTitle>
        <DialogContent id="comment-dialog-description">
          {[...new Array(50)].map((v, i) => (
            <CommentCard key={i} />
          ))}
        </DialogContent>
      </Dialog>
      <FloatingActions />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  await apolloClient.query<GetPost, GetPostVariables>({
    query: GET_POST,
    variables: { id: parseInt(params!.postId as string, 10) },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    unstable_revalidate: 1,
  };
};

export default PostPage;
