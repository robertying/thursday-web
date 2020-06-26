import React, { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Avatar,
  Snackbar,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Link from "next/link";
import { login } from "apis/cognito";
import { route } from "next/dist/next-server/server/router";
import { useRouter } from "next/router";
import useUserSession from "lib/useUserSession";

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
      maxHeight: "50vh",
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
  })
);

interface FormState {
  username: string;
  password: string;
  showPassword: boolean;
}

const LoginPage: React.FC = () => {
  const classes = useStyles();

  const router = useRouter();

  const { session } = useUserSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  const [values, setValues] = React.useState<FormState>({
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
      setTimeout(() => router.push("/"), 1000);
    } catch (err) {
      if (
        err.code === "UserLambdaValidationException" &&
        err.message.includes("Tsinghua email not verified")
      ) {
        setMessage("清华身份未验证");
        setNeedTsinghuaVerification(true);
      } else if (
        err.code === "UserLambdaValidationException" &&
        err.message.includes("User not found")
      ) {
        setMessage("用户名或密码错误");
      } else if (err.code === "UserNotConfirmedException") {
        setMessage("账号未验证");
        setNeedVerification(true);
      } else if (err.code === "UsernameExistsException") {
        setMessage("用户已存在");
      } else {
        setMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      {loading && <LinearProgress />}
      <Paper className={classes.paper} component="form" elevation={8}>
        <Avatar className={classes.logo} src="/logo.png" />
        <TextField
          label="用户名"
          type="username"
          autoFocus
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
            href={{ pathname: "/verify", query: { username: values.username } }}
          >
            <a>
              <Button>验证账号</Button>
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
              <Button>验证清华身份</Button>
            </a>
          </Link>
        )}
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
      <Snackbar
        open={message ? true : false}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={<span>{message}</span>}
      />
    </div>
  );
};

export default LoginPage;
