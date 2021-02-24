import { Type } from "../Typography";
import Box from "../Box";
import styled from "@emotion/styled";

const OrderedList = ({ children, ...rest }) => (
  <OrderedList.Styled
    as="ol"
    marginLeft="2rem"
    marginBottom="1.75rem"
    {...rest}
  >
    {children}
  </OrderedList.Styled>
);
OrderedList.Styled = styled(Box)`
  list-style-type: decimal;
  text-indent: 0.5rem;
`;

const UnorderedList = ({ children, ...rest }) => (
  <UnorderedList.Styled
    as="ol"
    marginLeft="2rem"
    marginBottom="1.75rem"
    {...rest}
  >
    {children}
  </UnorderedList.Styled>
);
UnorderedList.Styled = styled(Box)`
  list-style-type: disc;
  text-indent: 0.5rem;
`;

const ListItem = ({ children, ...rest }) => (
  <Type as="li" {...rest}>
    {children}
  </Type>
);

const List = ({ ordered = false, ...rest }) =>
  ordered ? <OrderedList {...rest} /> : <UnorderedList {...rest} />;

export { List, OrderedList, UnorderedList, ListItem };
