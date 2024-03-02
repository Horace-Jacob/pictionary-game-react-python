export type JwtType = {
  id: number;
  email: string;
  name: string;
  picture: string;
};

export interface ProtectedLinkProps {
  to: string;
  children: React.ReactNode;
}
