import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Selector } from "../shared/Selector";
import { playerCount, timeLimitData } from "../../utils/sharedData";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../lib/SocketProvider";
import { BeatLoader } from "react-spinners";
import { getUserEmail, getUsername, getUserPicture } from "../../utils/shared";

interface IGameModal {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export const GameModal: React.FC<IGameModal> = ({ isOpen, onClose, title }) => {
  const navigator = useNavigate();
  const [selectedTimeLimit, setSelectedTimeLimit] = React.useState(
    timeLimitData[0].name
  );
  const [selectedPlayerCount, setSelectedPlayerCount] = React.useState(
    playerCount[0].name
  );
  const [privacy, setPrivacy] = React.useState<string>("public");
  const [btnLoading, setBtnLoading] = React.useState<boolean>(false);
  const socket = useSocket();
  const modalRoot = document.getElementById("modal-root") as Element;
  if (!modalRoot) {
    return null;
  }

  const handleCreateRoom = () => {
    setBtnLoading(true);
    const username = getUsername();
    const picture = getUserPicture();
    const hostEmail = getUserEmail();
    const roomSettings = {
      playerCount: selectedPlayerCount,
      timeLimit: selectedTimeLimit,
      privacy: privacy,
      name: username,
      gameTitle: title,
      picture: picture,
      status: false,
      hostEmail: hostEmail,
    };
    socket.emit("createRoom", roomSettings);
    socket.on("createRoom", (data) => {
      setBtnLoading(false);
      navigator(`/liveGame/${data.message}`);
    });
  };

  return ReactDOM.createPortal(
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className={`relative z-50`} onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-2"
                  >
                    {title}
                  </Dialog.Title>
                  <div
                    className="w-full bg-slate-400 mb-2"
                    style={{ height: "2px" }}
                  ></div>
                  <div>
                    <p className="text-xs" style={{ color: "#02203c" }}>
                      Max Time Per Question
                    </p>
                    <Selector
                      data={timeLimitData}
                      onSelect={setSelectedTimeLimit}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs" style={{ color: "#02203c" }}>
                      Player Count
                    </p>
                    <Selector
                      data={playerCount}
                      onSelect={setSelectedPlayerCount}
                    />
                  </div>
                  <div className="mt-4 flex flex-col ">
                    <p className="text-xs mb-1" style={{ color: "#02203c" }}>
                      Who can join the activity?
                    </p>
                    <div className="flex gap-3 flex-row items-center">
                      <div className="flex items-center space-x-2 w-auto h-auto">
                        <input
                          type="radio"
                          className="form-radio text-indigo-600"
                          id="public"
                          name="privacy"
                          defaultChecked
                          value="public"
                          onChange={() => setPrivacy("public")}
                        />
                        <label
                          htmlFor="public"
                          className="text-base sm:text-sm text-gray-700"
                        >
                          Public
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 w-auto h-auto">
                        <input
                          type="radio"
                          className="form-radio text-indigo-600"
                          id="private"
                          name="privacy"
                          onChange={() => setPrivacy("private")}
                        />
                        <label
                          htmlFor="private"
                          className="text-base sm:text-sm text-gray-700"
                        >
                          Private
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 bottom-0">
                    <div
                      onClick={onClose}
                      className="p-2 cursor-pointer w-20  rounded-md hover:bg-slate-200 transition-all duration-300 ease-in-out"
                    >
                      <p
                        className="text-center font-normal text-base sm:text-sm"
                        style={{ color: "#02203c" }}
                      >
                        Close
                      </p>
                    </div>
                    <div
                      onClick={handleCreateRoom}
                      className="p-1 border cursor-pointer w-20 rounded-md shadow-sm bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 ease-in-out"
                    >
                      {btnLoading ? (
                        <p className="flex justify-center items-center p-2">
                          <BeatLoader color="#36d7b7" size={8} />
                        </p>
                      ) : (
                        <p
                          className="text-center font-normal text-base sm:text-sm p-1"
                          style={{ color: "#02203c" }}
                        >
                          Next
                        </p>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>,
    modalRoot
  );
};
