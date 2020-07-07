import React from "react";
import { Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core/Typography";

export interface ArticleProps extends TypographyProps {}

const Article: React.FC<ArticleProps> = props => {
  const { children, ...restProps } = props;

  return (
    <Typography
      variant="body1"
      component="article"
      gutterBottom
      style={{
        whiteSpace: "pre-line"
      }}
      {...restProps}
    >
      {children}
    </Typography>
  );
};

export default Article;
