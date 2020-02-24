import Box from "../Box";

const Blockquote = ({ children, ...rest }) => (
  <Box as="blockquote" {...rest}>
    {children}
  </Box>
);
Blockquote.propTypes = {
  ...Box.propTypes,
};

export default Blockquote;
