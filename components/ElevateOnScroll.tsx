import { useScrollTrigger } from "@material-ui/core";

export interface ElevateOnScrollProps {
  children: React.ReactElement;
  threshold?: number;
  path?: string;
}

const ElevateOnScroll: React.FC<ElevateOnScrollProps> = (props) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: props.threshold ?? 0,
  });

  return React.cloneElement(props.children, {
    elevation: trigger ? 4 : 0,
  });
};

export default ElevateOnScroll;
