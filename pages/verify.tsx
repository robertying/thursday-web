import React, { useState, useRef, useEffect } from "react";
import {
  Paper,
  TextField,
  Button,
  Snackbar,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";
import ReCAPTCHA from "react-google-recaptcha";
import { validateEmail } from "lib/validate";
import { confirmRegistration, resendConfirmationCode } from "apis/cognito";

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

const VerifyPage: React.FC = () => {
  const classes = useStyles();

  const router = useRouter();
  const username = router.query.username as string | undefined;
  const tsinghua = router.query.type === "tsinghua";
  const token = router.query.token as string | undefined;

  const [values, setValues] = React.useState({
    username: "",
    tsinghuaEmail: "",
    code: "",
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (username) {
      setValues({ ...values, username });
    }
  }, [username]);

  const [loading, setLoading] = useState(false);

  const handleTsinghuaVerify = async () => {
    if (tsinghua && token) {
      setLoading(true);
      try {
        const response = await fetch("/api/verifications", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            action: "fulfill",
            token,
          }),
        });
        if (!response.ok) {
          throw new Error("Verification failed");
        }
        setMessage({ text: "清华身份验证成功" });
      } catch (e) {
        setMessage({ text: "清华身份验证失败" });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    handleTsinghuaVerify();
  }, [tsinghua, token]);

  const handleVerify = async () => {
    if (!values.username) {
      setMessage({ text: "请输入需要验证的账户的用户名" });
      return;
    }

    if (tsinghua) {
      if (!values.tsinghuaEmail || !validateEmail(values.tsinghuaEmail, true)) {
        setMessage({ text: "请输入正确的清华邮箱" });
        return;
      }

      const recaptcha = recaptchaRef.current?.getValue();
      if (!recaptcha) {
        setMessage({ text: "请通过 reCAPTCHA 验证" });
        return;
      }

      setLoading(true);

      const response = await fetch("/api/verifications", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          action: "request",
          username: values.username,
          tsinghuaEmail: values.tsinghuaEmail,
          recaptcha,
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          setMessage({ text: "reCAPTCHA 验证失败" });
        } else {
          setMessage({ text: "验证邮件发送失败" });
        }
      } else {
        setMessage({ text: "验证邮件发送成功" });
      }

      setLoading(false);
      recaptchaRef.current?.reset();

      return;
    }

    if (!values.code) {
      setMessage({ text: "请输入注册邮箱收到的 6 位验证码" });
      return;
    }

    try {
      setLoading(true);
      await confirmRegistration(values.username, values.code);
      setMessage({
        text: "验证成功！请重新登录",
        duration: null,
      });
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
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
      <NextSeo title="验证" />
      {loading && <LinearProgress className={classes.loading} />}
      <Paper className={classes.paper} component="form" elevation={8}>
        {tsinghua && token ? (
          <>
            <TextField
              label="TOKEN"
              type="text"
              disabled
              multiline
              fullWidth
              rows={9}
              value={token}
            />
            <Link
              href={{
                pathname: "/verify",
                query: { username: values.username, type: "tsinghua" },
              }}
            >
              <a>
                <Button>重新获取验证链接</Button>
              </a>
            </Link>
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
                onClick={handleTsinghuaVerify}
              >
                验证
              </Button>
            </div>
          </>
        ) : (
          <>
            <TextField
              label="用户名"
              helperText="需要验证的账户的用户名"
              type="text"
              autoComplete="username"
              fullWidth
              value={values.username}
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
            />
            {tsinghua && (
              <>
                <TextField
                  label="清华邮箱"
                  helperText="需要后缀为 tsinghua.edu.cn 或 tsinghua.org.cn 的邮箱；清华邮箱仅用作一次性验证，后端只保存验证时间，不保存邮箱地址"
                  type="email"
                  autoComplete="email"
                  fullWidth
                  value={values.tsinghuaEmail}
                  onChange={(e) =>
                    setValues({ ...values, tsinghuaEmail: e.target.value })
                  }
                />
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LfusMkUAAAAAJRl9ZXEMuetPe5eX9lqVkjvaOqv"
                />
              </>
            )}
            {!tsinghua && (
              <>
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
                  onChange={(e) =>
                    setValues({ ...values, code: e.target.value })
                  }
                />
              </>
            )}
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
          </>
        )}
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
