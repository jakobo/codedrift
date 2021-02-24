import Box from "../Box";
import React from "react";

const Blockquote = ({ children, ...rest }) => (
  <Box as="blockquote" {...rest}>
    {children}
  </Box>
);
Blockquote.displayName = "Blockquote";
Blockquote.propTypes = {
  ...Box.propTypes,
};

export default Blockquote;
