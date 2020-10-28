import { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Snackbar,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { animated, useTransition } from "react-spring";
import { login } from "apis/cognito";
import useUserSession from "lib/useUserSession";
import useInterval from "lib/useInterval";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      minHeight: "100vh",
      backgroundImage: "url(/background.png)",
      backgroundRepeat: "repeat",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    logo: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    paper: {
      margin: "auto",
      padding: theme.spacing(4),
      width: "15vw",
      minWidth: 320,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      "& > *": {
        margin: theme.spacing(2),
      },
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      "& > *": {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
      },
    },
    loading: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1199,
    },
    topic: {
      position: "relative",
      width: "100%",
      textAlign: "center",
    },
  })
);

interface FormState {
  username: string;
  password: string;
  showPassword: boolean;
}

let previousIndex = 0;

export const getRandomTopic = (topics: LoginPageProps["topics"]) => {
  const t = [...topics];
  t.splice(previousIndex, 1);

  const topic = t[Math.floor(Math.random() * t.length)];
  previousIndex = topics.indexOf(topic);

  return topic;
};

const AnimatedTypography = animated(Typography);

export interface LoginPageProps {
  topics: {
    name: string;
  }[];
}

const LoginPage: React.FC<LoginPageProps> = ({ topics }) => {
  const classes = useStyles();

  const router = useRouter();
  const { redirect_url } = router.query;

  const { session } = useUserSession();

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (session) {
      setRedirecting(true);
      setTimeout(
        () => router.push((redirect_url as string | undefined) ?? "/"),
        1000
      );
    }
  }, [redirect_url, router, session]);

  const [values, setValues] = useState<FormState>({
    username: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({ ...values, [prop]: event.target.value.trim() });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [needVerification, setNeedVerification] = useState(false);
  const [needTsinghuaVerification, setNeedTsinghuaVerification] = useState(
    false
  );

  const handleLogin = async () => {
    if (!values.password || !values.username) {
      setMessage("请输入用户名和密码");
      return;
    }

    try {
      setLoading(true);
      await login(values.username, values.password);
      setMessage("登录成功");
      setTimeout(
        () => router.push((redirect_url as string | undefined) ?? "/"),
        1000
      );
    } catch (err) {
      if (
        err.code === "UserLambdaValidationException" &&
        err.message.includes("Tsinghua identity is not verified")
      ) {
        setMessage("清华身份未验证或需要重新验证");
        setNeedTsinghuaVerification(true);
      } else if (
        err.code === "UserLambdaValidationException" &&
        err.message.includes("User not found")
      ) {
        setMessage("用户名或密码错误");
      } else if (
        err.code === "UserLambdaValidationException" &&
        err.message.includes("Regular email not verified")
      ) {
        setMessage("注册邮箱未验证");
        setNeedVerification(true);
      } else if (err.code === "UserNotConfirmedException") {
        setMessage("账号未验证");
        setNeedVerification(true);
      } else if (err.code === "UsernameExistsException") {
        setMessage("用户已存在");
      } else if (err.code === "NotAuthorizedException") {
        setMessage("用户名或密码错误");
      } else {
        setMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const [topic, setTopic] = useState(topics[0]);
  const transitions = useTransition(topic, (item) => item.name, {
    from: {
      position: "absolute",
      opacity: 0,
      left: 0,
      right: 0,
      margin: "0 auto",
    },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  useInterval(() => setTopic(getRandomTopic(topics)), 1500);

  return (
    <div className={classes.root}>
      <NextSeo title="登录" />
      <Alert severity="info">
        星期四在 2020 年 10 月 12
        日对账户系统进行了迁移。如果您在过去注册过星期四账号，可能需要重新注册。给您带来不便，尽请谅解。
      </Alert>
      {loading && <LinearProgress className={classes.loading} />}
      {redirecting ? (
        <Paper className={classes.paper} component="form" elevation={8}>
          <Typography variant="h6">已登录，自动跳转中……</Typography>
        </Paper>
      ) : (
        <Paper className={classes.paper} component="form" elevation={8}>
          <Image className={classes.logo} src="/logo.png" alt="logo" unsized />
          <Typography>星期四｜Thursday</Typography>
          <div className={classes.topic}>
            {transitions.map(({ item, key, props }) => (
              <AnimatedTypography key={key} style={props}>
                {item.name ? "#" + item.name : ""}
              </AnimatedTypography>
            ))}
          </div>
          <TextField
            label="用户名"
            type="text"
            autoComplete="username"
            fullWidth
            value={values.username}
            onChange={handleChange("username")}
          />
          <TextField
            label="密码"
            autoComplete="current-password"
            type={values.showPassword ? "text" : "password"}
            fullWidth
            value={values.password}
            onChange={handleChange("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {needVerification && (
            <Link
              href={{
                pathname: "/verify",
                query: { username: values.username, request: true },
              }}
            >
              <a>
                <Button variant="outlined">验证账号</Button>
              </a>
            </Link>
          )}
          {needTsinghuaVerification && (
            <Link
              href={{
                pathname: "/verify",
                query: { username: values.username, type: "tsinghua" },
              }}
            >
              <a>
                <Button variant="outlined">验证清华身份</Button>
              </a>
            </Link>
          )}
          <Link href="/forgot">
            <a>找回密码</a>
          </Link>
          <div className={classes.buttons}>
            <Link href="/register">
              <a>
                <Button>注册</Button>
              </a>
            </Link>
            <Button
              color="primary"
              variant="contained"
              disabled={loading}
              onClick={handleLogin}
            >
              登录
            </Button>
          </div>
        </Paper>
      )}
      <Snackbar
        open={message ? true : false}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={<span>{message}</span>}
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps<LoginPageProps> = async () => {
  const res = await fetch(`${process.env.API_URL}/v1/graphql`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
    },
    body: JSON.stringify({
      query: `
        query GetTopics {
          topic(where: {category_id: {_neq: 2}}) {
            name
          }
        }
      `,
    }),
  });
  const topicData = await res.json();

  return {
    props: {
      topics: topicData?.data?.topic ?? [],
    },
  };
};

export default LoginPage;
