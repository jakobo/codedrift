import {
  background,
  border,
  compose,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  textAlign,
} from "styled-system";
import React, { forwardRef } from "react";
import styled from "@emotion/styled";

const Box = forwardRef(({ ...rest }, ref) => (
  <Box.Styled ref={ref} {...rest} />
));
Box.displayName = "Box";
Box.Styled = styled("div")(
  compose(
    space,
    grid,
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
  ...grid.propTypes,
};

export default Box;
