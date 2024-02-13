import React from "react";
import { handleLogin } from "../../api/api";
import ProtectedLink from "../auth/ProtectedLink";
import { isAuth } from "../../utils/shared";

interface INavbar {
  username: string;
  currentTab: string;
}

export const Navbar: React.FC<INavbar> = ({ username, currentTab }) => {
  return (
    <div className="bg-[#434344] w-full z-50">
      <nav className="nav">
        <ul className="nav-ul">
          <li className="nav-link flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#DADADA"
              className="w-5 h-5"
            >
              <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" />
            </svg>
            <p className="ml-1">Pictionary Game</p>
          </li>
          <ProtectedLink to="/">
            <li
              className={`nav-link ${
                currentTab === "activities" ? "nav-link-open" : ""
              }`}
            >
              Activities
            </li>
          </ProtectedLink>
          <ProtectedLink to="/history">
            <li
              className={`nav-link ${
                currentTab === "history" ? "nav-link-open" : ""
              }`}
            >
              History
            </li>
          </ProtectedLink>
          <ProtectedLink to="/friends">
            <li
              className={`nav-link ${
                currentTab === "friends" ? "nav-link-open" : ""
              }`}
            >
              Friends
            </li>
          </ProtectedLink>
          <ProtectedLink to="/rooms">
            <li
              className={`nav-link ${
                currentTab === "rooms" ? "nav-link-open" : ""
              }`}
            >
              Rooms
            </li>
          </ProtectedLink>
          <li className="nav-link">
            <div className="search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input type="text" placeholder="Search.." />
            </div>
          </li>
          <li className="nav-link">{username}</li>
          {isAuth() ? (
            <li className="nav-link">Logout</li>
          ) : (
            <ProtectedLink to="/">
              <li className="nav-link">Login</li>
            </ProtectedLink>
          )}
        </ul>
      </nav>
    </div>
  );
};
