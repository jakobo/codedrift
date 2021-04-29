import Prism from "prismjs";
import React, { useEffect, useRef } from "react";

// configure custom prism aliases
Prism.languages.gql = Prism.languages.graphql;

const PrismCode = ({ className, children }) => {
  const ref = useRef();
  useEffect(() => {
    if (ref && ref.current && className) {
      Prism.highlightElement(ref.current);
    }
  }, []);
  return (
    <code ref={ref} className={className}>
      {children}
    </code>
  );
};
export default PrismCode;
