import React, { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Button,
  Snackbar,
  LinearProgress,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { validatePassword } from "lib/validate";
import { confirmPassword, forgotPassword } from "apis/cognito";

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
    paper: {
      margin: "auto",
      padding: theme.spacing(4),
      width: "15vw",
      minWidth: 330,
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
  })
);

const ForgotPage: React.FC = () => {
  const classes = useStyles();

  const router = useRouter();

  const [values, setValues] = React.useState({
    username: "",
    code: "",
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
    if (!values.username) {
      setMessage({ text: "请输入需要找回密码的账户的用户名" });
      return;
    }

    if (!values.code) {
      setMessage({ text: "请输入注册邮箱收到的 6 位验证码" });
      return;
    }

    if (!validatePassword(values.password)) {
      setMessage({ text: "请输入满足要求的新密码" });
      return;
    }

    try {
      setLoading(true);
      await confirmPassword(values.username, values.code, values.password);
      setMessage({
        text: "密码重置成功！请重新登录",
      });
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      if (err.code === "CodeMismatchException") {
        setMessage({ text: "验证码不匹配该用户" });
      } else if (err.code === "ExpiredCodeException") {
        setMessage({ text: "验证码已失效，请重新获取" });
      } else {
        setMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    router.prefetch("/login");
  }, []);

  const [resendButtonDisabled, setResendButtonDisabled] = useState(false);

  const handleResend = async () => {
    if (!values.username) {
      setMessage({ text: "请输入需要找回密码的账户的用户名" });
      return;
    }

    setResendButtonDisabled(true);

    await forgotPassword(values.username);
    setMessage({
      text: "验证码已发送，请检查注册邮箱的收件箱或垃圾箱",
      duration: 30 * 1000,
    });

    setTimeout(() => setResendButtonDisabled(false), 30 * 1000);
  };

  const [message, setMessage] = useState<{
    text: string;
    duration?: number | null;
  }>({ text: "", duration: 3000 });

  return (
    <div className={classes.root}>
      <NextSeo title="找回密码" />
      {loading && <LinearProgress className={classes.loading} />}
      <Paper className={classes.paper} component="form" elevation={8}>
        <TextField
          label="用户名"
          helperText="需要找回密码的账户的用户名"
          type="text"
          autoComplete="username"
          fullWidth
          value={values.username}
          onChange={(e) => setValues({ ...values, username: e.target.value })}
        />
        <Button disabled={resendButtonDisabled} onClick={handleResend}>
          获取验证码
        </Button>
        <TextField
          label="验证码"
          helperText="注册邮箱收到的 6 位验证码"
          autoComplete="one-time-code"
          type="number"
          fullWidth
          value={values.code}
          onChange={(e) => setValues({ ...values, code: e.target.value })}
        />
        <TextField
          label="新密码"
          helperText="长度至少为 8，需包含大小写字母及数字；可包括 !@#$%^&* 特殊符号"
          autoComplete="new-password"
          type={values.showPassword ? "text" : "password"}
          fullWidth
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
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
        <div className={classes.buttons}>
          <Link href="/login">
            <a>
              <Button>返回登录</Button>
            </a>
          </Link>
          <Button
            color="primary"
            variant="contained"
            disabled={loading}
            onClick={handleForgot}
          >
            重置密码
          </Button>
        </div>
      </Paper>
      <Snackbar
        open={message.text ? true : false}
        autoHideDuration={message.duration}
        onClose={() => setMessage({ text: "", duration: 3000 })}
        message={<span>{message.text}</span>}
      />
    </div>
  );
};

export default ForgotPage;
