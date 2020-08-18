import React, { useState } from "react";
import { Container, Grid, Paper, Typography, Button } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useQuery } from "@apollo/client";
import PostCard from "components/PostCard";
import FloatingActions from "components/FloatingActions";
import Layout from "components/Layout";
import {
  GetTopicPosts,
  GetTopicPostsByTags,
  GetTopicPostsByTagsVariables,
  GetTopicPostsVariables,
  GetUser,
  GetUserVariables,
} from "apis/types";
import { GET_TOPIC_POSTS, GET_TOPIC_POSTS_BY_TAGS } from "apis/topic_post";
import { initializeApollo } from "apis/client";
import useUserId from "lib/useUserId";
import { GET_USER } from "apis/user";
import { getUserId, getUserSession } from "apis/cognito";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: "auto",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      width: "100%",
    },
    paper: {
      padding: theme.spacing(4),
      "& > *": {
        margin: theme.spacing(2),
      },
    },
    tagSearch: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: theme.spacing(1),
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

const TopicPostPage: React.FC = () => {
  const classes = useStyles();

  const userId = useUserId();

  const { data: userData } = useQuery<GetUser, GetUserVariables>(GET_USER, {
    variables: {
      id: userId!,
    },
    skip: !userId,
  });

  const router = useRouter();
  const { topicId, tag } = router.query;
  const tags = tag ? (Array.isArray(tag) ? tag : [tag]) : [];

  const { data: d } = useQuery<GetTopicPosts, GetTopicPostsVariables>(
    GET_TOPIC_POSTS,
    {
      variables: { id: parseInt(topicId as string, 10) },
      skip: tags.length !== 0,
    }
  );
  const { data: dT } = useQuery<
    GetTopicPostsByTags,
    GetTopicPostsByTagsVariables
  >(GET_TOPIC_POSTS_BY_TAGS, {
    variables: { id: parseInt(topicId as string, 10), tags },
    skip: tags.length === 0,
  });
  const data = dT ?? d;

  const [searchTags, setSearchTags] = useState(tags);

  const handleAddChip = (tag: string) => {
    setSearchTags([...tags, tag]);
  };

  const handleDeleteChip = (tag: string, index: number) => {
    const newTags = [...searchTags];
    newTags.splice(index, 1);
    setSearchTags(newTags);
  };

  const handleTagSearchClick = async () => {
    router.push({ pathname: `/topics/${topicId}`, query: { tag: searchTags } });
  };

  return (
    <Layout
      page="topic-posts"
      title={`#${data?.topic?.[0].name}`}
      backHref="/topics"
      username={userData?.user_by_pk?.username}
      userAvatarUrl={userData?.user_by_pk?.avatar_url}
    >
      <NextSeo title={`#${data?.topic?.[0].name}`} />
      <Grid
        className={classes.root}
        container
        component={Container as any}
        maxWidth="md"
        direction="column"
        spacing={2}
      >
        <div className={classes.tagSearch}>
          <ChipInput
            classes={{ chip: classes.chip }}
            value={searchTags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip, index) => handleDeleteChip(chip, index)}
            alwaysShowPlaceholder
            placeholder="筛选标签"
            blurBehavior="clear"
            disableUnderline
            fullWidth
          />
          <Button onClick={handleTagSearchClick}>搜索</Button>
        </div>
        {data?.topic?.[0].posts.map((post) => (
          <Grid item key={post.id}>
            <Link
              href="/topics/[topicId]/posts/[postId]"
              as={`/topics/${topicId}/posts/${post.id}`}
            >
              <a>
                <PostCard {...post} />
              </a>
            </Link>
          </Grid>
        ))}
        {data?.topic?.[0].posts.length === 0 && (
          <Paper className={classes.paper}>
            <Typography variant="h3">Ehh……啥都没有</Typography>
            <Typography variant="body1" gutterBottom>
              此话题下暂无相关帖子
            </Typography>
            <Link
              href={{
                pathname: `/topics/${topicId}/edit`,
                query: tag && { tag },
              }}
            >
              <a>
                <Button color="primary">发表帖子</Button>
              </a>
            </Link>
          </Paper>
        )}
      </Grid>
      <FloatingActions edit />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { session, user } = await getUserSession(ctx);
    const userId = (await getUserId(user))!;

    const apolloClient = initializeApollo(null, session);

    await apolloClient.query<GetUser, GetUserVariables>({
      query: GET_USER,
      variables: {
        id: userId,
      },
    });

    const { tag } = ctx.query;
    const tags = Array.isArray(tag) ? tag : [tag];

    let result;
    if (tag && tags.length !== 0) {
      result = await apolloClient.query<
        GetTopicPostsByTags,
        GetTopicPostsByTagsVariables
      >({
        query: GET_TOPIC_POSTS_BY_TAGS,
        variables: {
          id: parseInt(ctx.params!.topicId as string, 10),
          tags: tags as string[],
        },
      });
    } else {
      result = await apolloClient.query<GetTopicPosts, GetTopicPostsVariables>({
        query: GET_TOPIC_POSTS,
        variables: { id: parseInt(ctx.params!.topicId as string, 10) },
      });
    }
    if (result.data?.topic.length === 0) {
      const { res } = ctx;
      res.writeHead(303, "Not found", {
        Location: `/404`,
      });
      res.end();
      return {
        props: {},
      };
    }

    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    const { res } = ctx;
    res.writeHead(303, "Unauthorized", {
      Location: `/login?redirect_url=${ctx.req.url}`,
    });
    res.end();
    return {
      props: {},
    };
  }
};

export default TopicPostPage;
