import React from "react";
import { useSocket } from "../../lib/SocketProvider";
import {
  getUsername,
  notify,
  gameEventNotify,
  getUserPicture,
  getUserEmail,
} from "../../utils/shared";
import { CLIENT_ENDPOINT } from "../../api/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LiveGameSection } from "./LiveGameSection";

interface ILiveGameSection {
  roomCode?: string;
}

export const WaitingRoomSection: React.FC<ILiveGameSection> = ({
  roomCode,
}) => {
  const [gameTitle, setGameTitle] = React.useState<string>("");
  const [hostName, setHostName] = React.useState<string>("");
  const [hostEmail, setHostEmail] = React.useState<string>("");
  const [totalPlayer, setTotalPlayer] = React.useState<number>();
  const [playerPictures, setPlayerPictures] = React.useState<string[]>([]);
  const [gameStatus, setGameStatus] = React.useState<boolean>(false);
  const [boardChangeStatus, setBoardChangeStatus] =
    React.useState<boolean>(false);
  const socket = useSocket();

  const handleStartGame = () => {
    setBoardChangeStatus(true);
    const data = {
      roomCode: roomCode,
    };
    // socket.emit("checkPlayerCount", data);
    // socket.on("checkPlayerCount", (playerCount) => {
    //   if (playerCount.data === 1) {
    //     gameEventNotify("Require at least 2 players to start the game");
    //   } else if (playerCount.data > 1) {
    //     setGameStatus(true);
    //     socket.emit("startGame", data);
    //   }
    // });
    setGameStatus(true);
    socket.emit("startGame", data);
    setBoardChangeStatus(false);
  };

  const checkHost = () => {
    const currentPlayerEmail = getUserEmail();
    return currentPlayerEmail === hostEmail;
  };

  React.useEffect(() => {
    const picture = getUserPicture();
    const username = getUsername();
    const data = {
      roomCode: roomCode,
      name: username,
      picture: picture,
    };
    socket.emit("joinRoom", data);
    socket.on("roomCreated", ({ message, data }) => {
      const deserializedData = JSON.parse(data);
      setHostName(deserializedData.name);
      setGameTitle(deserializedData.gameTitle);
      setTotalPlayer(deserializedData.total_players);
      setGameStatus(deserializedData.status);
      setHostEmail(deserializedData.hostEmail);
      setPlayerPictures(Object.values(deserializedData.player_pictures));
    });
    socket.on("playerDisconnected", ({ message, data }) => {
      const deserializedData = JSON.parse(data);
      setTotalPlayer(deserializedData.total_players);
      setHostName(deserializedData.name);
      setGameStatus(deserializedData.status);
      setGameTitle(deserializedData.gameTitle);
      setHostEmail(deserializedData.hostEmail);
      setPlayerPictures(Object.values(deserializedData.player_pictures));
      gameEventNotify(message);
    });
    socket.on("newPlayerJoinedRoom", ({ message, data }) => {
      const deserializedData = JSON.parse(data);
      setHostName(deserializedData.name);
      setGameStatus(deserializedData.status);
      setGameTitle(deserializedData.gameTitle);
      setTotalPlayer(deserializedData.total_players);
      setHostEmail(deserializedData.hostEmail);
      setPlayerPictures(Object.values(deserializedData.player_pictures));
      gameEventNotify(message);
    });
  }, [socket, gameStatus]);
  return (
    <main className="h-screen flex items-center justify-center">
      {gameStatus ? (
        <div>
          <LiveGameSection roomCode={roomCode} />
        </div>
      ) : (
        <div
          className="shadow-md border rounded-sm"
          style={{ maxWidth: "40%", minWidth: "30%", padding: "25px" }}
        >
          <div className="mb-2 text-inherit">{gameTitle}</div>
          <div className="mb-3 text-xs">Hosted By: {hostName}</div>
          <div className="mb-3 flex justify-center items-center">
            <div
              onClick={() => {
                navigator.clipboard.writeText(
                  `${CLIENT_ENDPOINT}/liveGame/${roomCode}`
                );
                notify("Copied Game Link");
              }}
              className="flex items-center justify-center border-2 border-indigo-400 p-3 rounded-3xl cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="rgb(129 140 248)"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
              <p className="ml-2 text-indigo-400 text-sm">Share Game Link</p>
              <ToastContainer
                autoClose={500}
                hideProgressBar
                closeOnClick
                draggable
                theme="dark"
                closeButton={false}
                position="top-center"
              />
            </div>
          </div>
          <div className="mb-3 flex justify-center flex-col items-center">
            <p className="text-sm mb-2">Players ({totalPlayer})</p>
            <div className="flex items-center gap-2">
              {playerPictures.map((playerPicture, index) => (
                <img
                  key={index}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                  src={playerPicture}
                  referrerPolicy="no-referrer"
                  alt={`Player ${index + 1}`}
                />
              ))}
            </div>
          </div>
          {checkHost() ? (
            <div
              className="flex justify-center items-center p-2"
              onClick={handleStartGame}
            >
              <div className="border p-2 rounded-lg">
                <p className="text-sm px-2">Start Game</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center p-2">
              <div className="border p-2 rounded-lg">
                <p className="text-sm px-2">Waiting for players to join game</p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
