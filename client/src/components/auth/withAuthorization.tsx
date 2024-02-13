// withAuthorization.tsx
import React from "react";
import { Link, LinkProps, useNavigate } from "react-router-dom";
import { LoginModal } from "../modals/LoginModal";

export interface ProtectedLinkProps extends LinkProps {
  to: string;
  children: React.ReactNode;
}

export const withAuthorization = (
  WrappedComponent: React.FC<ProtectedLinkProps>
) => {
  return (props: ProtectedLinkProps) => {
    const navigator = useNavigate();
    const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);

    const handleLinkClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.preventDefault();

      const token = localStorage.getItem("token");

      if (!token) {
        // If the user is not authorized, show the login modal
        setShowLoginModal(true);
      } else if (props.to) {
        // If the user is authorized, navigate to the specified link
        navigator(props.to as string);
      }
    };

    return (
      <>
        <WrappedComponent {...props} onClick={handleLinkClick}>
          {props.children}
        </WrappedComponent>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </>
    );
  };
};
