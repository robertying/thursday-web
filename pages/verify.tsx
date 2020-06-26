import React, { useState, useRef, useEffect } from "react";
import {
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Snackbar,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from "lib/validate";
import {
  signUp,
  confirmRegistration,
  resendConfirmationCode,
} from "apis/cognito";

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

const VerifyPage: React.FC = () => {
  const classes = useStyles();

  const router = useRouter();
  const username = router.query.username as string | undefined;

  const [values, setValues] = React.useState({
    username: "",
    code: "",
  });

  useEffect(() => {
    if (username) {
      setValues({ ...values, username });
    }
  }, [username]);

  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!values.username) {
      setMessage({ text: "请输入需要验证的账户的用户名" });
      return;
    }

    if (!values.code) {
      setMessage({ text: "请输入注册邮箱收到的 6 位验证码" });
      return;
    }

    try {
      setLoading(true);
      const result = await confirmRegistration(values.username, values.code);
      setMessage({
        text: "验证成功！请重新登录",
        duration: null,
      });
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      console.log(err);
      if (err.code === "CodeMismatchException") {
        setMessage({ text: "验证码不匹配该用户" });
      } else if (err.code === "ExpiredCodeException") {
        setMessage({ text: "验证码已失效，请重新获取" });
      } else if (err.code === "NotAuthorizedException") {
        setMessage({ text: "此用户已经通过邮箱验证" });
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
      setMessage({ text: "请输入需要验证的账户的用户名" });
      return;
    }

    setResendButtonDisabled(true);

    await resendConfirmationCode(values.username);
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
      {loading && <LinearProgress />}
      <Paper className={classes.paper} component="form" elevation={8}>
        <TextField
          label="用户名"
          helperText="需要验证的账户的用户名"
          type="text"
          autoComplete="username"
          fullWidth
          value={values.username}
          onChange={(e) => setValues({ ...values, username: e.target.value })}
        />
        <Button disabled={resendButtonDisabled} onClick={handleResend}>
          重新获取验证码
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
            onClick={handleVerify}
          >
            验证
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

export default VerifyPage;
