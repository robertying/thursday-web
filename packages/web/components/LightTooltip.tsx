import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip);

export default LightTooltip;
