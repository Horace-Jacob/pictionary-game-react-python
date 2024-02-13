export type JwtType = {
  email: string;
  name: string;
  picture: string;
};

export interface ProtectedLinkProps {
  to: string;
  children: React.ReactNode;
}
