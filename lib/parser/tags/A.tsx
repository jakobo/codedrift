import Link from "next/link";
import React, { HTMLAttributes } from "react";

interface AnchorTagProps extends HTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export const A: React.FC<AnchorTagProps> = ({ href, children, ...rest }) => {
  return (
    <Link href={href} passHref>
      <a href={href} {...rest}>
        {children}
      </a>
    </Link>
  );
};
