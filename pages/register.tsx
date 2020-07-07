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
import { NextSeo } from "next-seo";
import ReCAPTCHA from "react-google-recaptcha";
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from "lib/validate";
import { signUp } from "apis/cognito";

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
  })
);

interface FormState {
  email: string;
  username: string;
  password: string;
  showPassword: boolean;
}

const RegisterPage: React.FC = () => {
  const classes = useStyles();

  const router = useRouter();

  const [values, setValues] = React.useState<FormState>({
    email: "",
    username: "",
    password: "",
    showPassword: false,
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);

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

  const handleRegister = async () => {
    if (!values.email || !values.password || !values.username) {
      setMessage({ text: "请完整填写所有信息" });
      return;
    }

    if (!validateEmail(values.email, false)) {
      setMessage({ text: "请输入正确的非清华邮箱" });
      return;
    }

    if (!validateUsername(values.username)) {
      setMessage({ text: "请设置满足要求的用户名" });
      return;
    }

    if (!validatePassword(values.password)) {
      setMessage({ text: "请设置满足要求的密码" });
      return;
    }

    const recaptcha = recaptchaRef.current?.getValue();
    if (!recaptcha) {
      setMessage({ text: "请通过 reCAPTCHA 验证" });
      return;
    }

    try {
      setLoading(true);
      await signUp({ ...values, recaptcha });
      setMessage({
        text: "注册成功！请使用注册邮箱内收到的验证码完成账户验证",
        duration: null,
      });
      setTimeout(
        () =>
          router.push({
            pathname: "/verify",
            query: {
              username: values.username,
            },
          }),
        1000
      );
    } catch (err) {
      if (err.code === "UserLambdaValidationException") {
        setMessage({ text: "reCAPTCHA 验证失败" });
      } else if (err.code === "UsernameExistsException") {
        setMessage({ text: "用户已存在" });
      } else {
        setMessage({ text: "未知错误：" + err.message });
      }
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    router.prefetch("/verify");
  }, []);

  const [message, setMessage] = useState<{
    text: string;
    duration?: number | null;
  }>({ text: "", duration: 3000 });

  return (
    <div className={classes.root}>
      <NextSeo title="注册" />
      {loading && <LinearProgress className={classes.loading} />}
      <Paper className={classes.paper} component="form" elevation={8}>
        <TextField
          label="邮箱"
          helperText="非清华邮箱"
          type="email"
          autoComplete="email"
          fullWidth
          value={values.email}
          onChange={handleChange("email")}
        />
        <TextField
          label="用户名"
          helperText="仅包含英文字母与阿拉伯数字"
          type="text"
          autoComplete="username"
          fullWidth
          value={values.username}
          onChange={handleChange("username")}
        />
        <TextField
          label="密码"
          helperText="长度至少为 10，需包含大小写字母及数字"
          autoComplete="new-password"
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
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LfusMkUAAAAAJRl9ZXEMuetPe5eX9lqVkjvaOqv"
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
            onClick={handleRegister}
          >
            注册
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

export default RegisterPage;
