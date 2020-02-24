import Box from "../Box";

const Layout = ({ children }) => {
  return (
    <Box maxWidth="42rem" marginLeft="auto" marginRight="auto" padding="2">
      {children}
    </Box>
  );
};

export default Layout;
