import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { handleLogin } from "../../api/api";
import Logo from "../../assets/logo.svg";

interface ILoginModal {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<ILoginModal> = ({ isOpen, onClose }) => {
  const modalRoot = document.getElementById("modal-root") as Element;
  if (!modalRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                <Dialog.Panel className="w-full border-t-4 border-teal-500 max-w-80 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mb-4 font-medium leading-6 text-gray-900 text-center text-2xl"
                  >
                    Sign in to
                  </Dialog.Title>
                  <Dialog.Title
                    as="h3"
                    className="mb-4  text-lg font-medium leading-6 text-gray-900 flex justify-center items-center"
                  >
                    <img src={Logo} alt="logo" />
                    <p
                      className="ml-2 font-normal"
                      style={{ color: "#02203c", fontSize: "30px" }}
                    >
                      Pictionary
                    </p>
                  </Dialog.Title>
                  <Dialog.Title
                    as="h3"
                    className="mb-4 font-medium leading-6 text-center text-inherit"
                    style={{ color: "#445d6e" }}
                  >
                    Log in to play the game. We won't post anything anywhere.
                  </Dialog.Title>
                  <div className="flex-col flex items-center justify-center">
                    <div
                      onClick={handleLogin}
                      className="flex items-center border-blue-500 border h-12 rounded-sm shadow-lg 
                                    transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
                    >
                      <div className="w-12 flex justify-center items-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 128 128"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="#fff"
                            d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38"
                          />
                          <path
                            fill="#e33629"
                            d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21"
                          />
                          <path
                            fill="#f8bd00"
                            d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9"
                          />
                          <path
                            fill="#587dbd"
                            d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68"
                          />
                          <path
                            fill="#319f43"
                            d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4"
                          />
                        </svg>
                      </div>
                      <div className="w-52 flex justify-center bg-blue-500 h-12 items-center text-white font-bold">
                        Google
                      </div>
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
