import React, { useState } from "react";
import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useQuery, useMutation } from "@apollo/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Post from "components/Post";
import Comment from "components/Comment";
import Layout from "components/Layout";
import FloatingActions from "components/FloatingActions";
import CommentCard from "components/CommentCard";
import { GetPost, GetPostVariables, emoji_reaction_enum } from "apis/types";
import { initializeApollo } from "apis/client";
import { GET_POST } from "apis/post";
import { ADD_REACTION } from "apis/reaction";
import { AddReaction, AddReactionVariables } from "apis/types";
import useUserId from "lib/useUserId";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: "auto",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  })
);

const PostPage: React.FC = () => {
  const classes = useStyles();

  const router = useRouter();
  const { postId } = router.query;

  const userId = useUserId();

  const { data, refetch } = useQuery<GetPost, GetPostVariables>(GET_POST, {
    variables: {
      id: parseInt(postId as string, 10),
    },
  });
  const post = data?.post?.[0];

  const [addReaction] = useMutation<AddReaction, AddReactionVariables>(
    ADD_REACTION
  );

  const handleReact = async (id: number, reaction: emoji_reaction_enum) => {
    await addReaction({
      variables: {
        post_id: id,
        user_id: userId,
        reaction,
      },
    });

    refetch();
  };

  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const handleModalClose = () => {
    setCommentModalVisible(false);
  };

  return (
    <Layout page="post" title={`#${post?.topic.name}`}>
      <Grid
        className={classes.root}
        container
        component={Container}
        direction="column"
        maxWidth="md"
        spacing={2}
      >
        <Grid item>
          <Post {...post!} onReact={handleReact} />
        </Grid>
        {post?.comments?.map((comment) => (
          <Grid item key={comment.id}>
            <Comment {...comment} />
          </Grid>
        ))}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo(null, ctx);

  try {
    await apolloClient.query<GetPost, GetPostVariables>({
      query: GET_POST,
      variables: { id: parseInt(ctx.params!.postId as string, 10) },
    });
  } catch (e) {
    const { res } = ctx;
    res.writeHead(303, "Unauthorized", {
      Location: "/login",
    });
    res.end();
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default PostPage;
