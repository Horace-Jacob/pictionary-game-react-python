import React from "react";
import { Link } from "react-router-dom";
import { withAuthorization, ProtectedLinkProps } from "./withAuthorization";

const ProtectedLink: React.FC<ProtectedLinkProps> = ({
  to,
  children,
  ...rest
}) => {
  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
};

export default withAuthorization(ProtectedLink);
