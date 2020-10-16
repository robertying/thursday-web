import { useState, useRef, useEffect } from "react";
import {
  Button,
  Snackbar,
  ButtonBase,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { CloudUpload, Image } from "@material-ui/icons";
import { v4 as uuid } from "uuid";
import { getOSS } from "lib/oss";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    imageButton: {
      width: 300,
      height: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      opacity: (props: { loading?: boolean }) => (props.loading ? 0.2 : 1),
      border: "dashed #9e9e9e",
    },
    input: {
      display: "none",
    },
    loading: {
      position: "absolute",
      margin: "auto",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    image: {
      opacity: (props: { loading?: boolean }) => (props.loading ? 0.2 : 1),
      maxWidth: "100%",
      maxHeight: "100%",
      width: "auto",
      height: "auto",
    },
    label: {
      position: "relative",
    },
  })
);

export interface UploadProps {
  open: boolean;
  avatar?: boolean;
  onClose?: () => void;
  onSubmit?: (url: string) => void;
  mbLimit?: number;
}

const Upload: React.FC<UploadProps> = ({
  open,
  onClose,
  onSubmit,
  mbLimit,
  avatar,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const classes = useStyles({ loading });

  useEffect(() => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (imgRef.current && e.target?.result) {
          imgRef.current.src = e.target?.result as string;
        }
      };

      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) {
      setMessage("请选择需上传的图片");
      return;
    }

    if (file.size > (mbLimit ?? 10) * 1024 * 1024) {
      setMessage(`上传图片大小限制为 ${mbLimit} MB`);
      return;
    }

    setLoading(true);
    try {
      const oss = await getOSS();
      const url = uuid();
      await oss.put(url, file);
      setMessage("上传成功");
      setUrl(url);
    } catch {
      setMessage("上传失败");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleSubmit = () => {
    if (!url) {
      setMessage("未上传任何图片");
      return;
    }
    onSubmit?.(url);
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>添加图片</DialogTitle>
      <DialogContent className={classes.root}>
        <input
          ref={inputRef}
          accept="image/*"
          className={classes.input}
          id="upload-image-button"
          type="file"
          disabled={loading}
          onChange={() => setFile(inputRef.current?.files?.[0] ?? null)}
        />
        <label htmlFor="upload-image-button" className={classes.label}>
          <ButtonBase
            component="div"
            className={classes.imageButton}
            disabled={loading}
          >
            <Image fontSize="large" />
            <Typography variant="subtitle1">选择图片</Typography>
          </ButtonBase>
          <img
            ref={imgRef}
            className={`${classes.image} ${classes.loading}`}
            style={{ cursor: "pointer" }}
            alt="上传图片"
          />
          {loading && <CircularProgress className={classes.loading} />}
        </label>
        {avatar && (
          <Typography variant="caption">
            头像会根据上传图片的长宽进行居中裁剪
          </Typography>
        )}
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUpload />}
            onClick={handleUpload}
            disabled={loading || (url ? true : false)}
          >
            上传
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          取消
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          确定
        </Button>
      </DialogActions>
      <Snackbar
        open={message ? true : false}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={<span>{message}</span>}
      />
    </Dialog>
  );
};

export default Upload;
