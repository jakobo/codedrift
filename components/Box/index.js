import styled from "@emotion/styled";
import PropTypes from "prop-types";
import {
  space,
  layout,
  flexbox,
  background,
  border,
  position,
  shadow,
  compose,
  textAlign,
} from "styled-system";

const Box = ({ ...rest }) => <Box.Styled {...rest} />;
Box.Styled = styled("div")(
  compose(
    space,
    layout,
    flexbox,
    background,
    border,
    position,
    shadow,
    textAlign
  )
);
Box.propTypes = {
  ...space.propTypes,
  ...layout.propTypes,
  ...flexbox.propTypes,
  ...background.propTypes,
  ...border.propTypes,
  ...position.propTypes,
  ...shadow.propTypes,
  ...textAlign.propTypes,
};

export default Box;
