const Picture: React.FC<React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>> = (props) => {
  const { alt, src, ...restProps } = props;
  return (
    <picture>
      <source type="image/webp" srcSet={`${src}/webp`} />
      <source srcSet={`${src}/comp`} />
      <img {...restProps} alt={alt} />
    </picture>
  );
};

export default Picture;
