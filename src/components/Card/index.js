import { system } from "styled-system";
import Box from "../Box";
import React from "react";
import styled from "@emotion/styled";

const Card = ({ elevation = 0, ...rest }) => {
  return <Card.Styled padding="1" margin="1" elevation={elevation} {...rest} />;
};
Card.Styled = styled(Box)`
  ${system({
    elevation: {
      property: "boxShadow",
      scale: "elevations",
    },
  })}
`;

export default Card;
