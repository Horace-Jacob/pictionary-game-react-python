import React from "react";
import { PictionaryData } from "../../utils/categories";
import { GameModal } from "../modals/GameModal";

interface IPictionaryGame {}

const PictionaryGame: React.FC<IPictionaryGame> = () => {
  const [showGameModal, setShowGameModal] = React.useState<boolean>(false);
  const [gameTitle, setGameTitle] = React.useState<string>("");

  const closeGameModal = () => {
    setShowGameModal(false);
  };

  const startGame = (title: string) => {
    setGameTitle(title);
    setShowGameModal(true);
  };

  return (
    <div className="grid grid-cols-4 p-8">
      {PictionaryData.map((items, index) => {
        return (
          <div
            key={index}
            onClick={() => startGame(items.name)}
            className={`flex flex-col border-l-4 border-purple-400 items-center justify-center shadow-lg mb-4 mr-4 
          min-h-64 rounded-md hover:opacity-60 cursor-pointer`}
          >
            <div className="">
              <p className="game-category-text border-b-2 border-teal-600 min-w-48">
                {items.name}
              </p>
              <h3 className="game-creator-text">By Pictionary</h3>
            </div>
          </div>
        );
      })}
      <GameModal
        isOpen={showGameModal}
        title={gameTitle}
        onClose={closeGameModal}
      />
    </div>
  );
};

export default PictionaryGame;
