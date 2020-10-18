import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Button from "./Button";
import Deadman from "./DeadMan";
import DeadLetters from "./DeadLetters";
import TheWord from "./TheWord";
import Keyboard from "./Keyboard";
import GameOverModal from "./GameOverModal";
import words from "../data/words.json";
import bodyParts from "../data/body-parts.json";

import { colors, contentWidth } from "./GlobalStyles";

const initialGameState = {
  started: false,
  over: false,
  win: false,
  pause: false,
};
const GameReset = {
  started: true,
  over: false,
  win: false,
  pause: false,
};

const App = () => {
  const [game, setGame] = useState(initialGameState);
  const [word, setWord] = useState({ str: "" });
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);

  const getNewWord = () => {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    let revealed = [];
    for (let i = 0; i < randomWord.length; i++) {
      revealed.push("");
    }
    setWord({ str: randomWord, revealed: revealed });
  };

  //get the start button to behave the way we want
  let startBtnDisp = "start";
  const handlePause = () => {
    setGame({ ...game, pause: !game.pause });
  };
  const handleStart = () => {
    setGame({ ...game, started: !game.started });
    {
      word.str === "" && getNewWord();
    }
  };

  if (game.started === true && game.pause === false) {
    startBtnDisp = "pause";
  } else if (game.started === true && game.pause === true) {
    startBtnDisp = "continue";
  } else {
    startBtnDisp = "start";
  }

  const showBodyPart = (part, color) => {
    document.querySelector(`.${part}`).style.stroke = color;
  };

  const handleGuess = (ltr) => {
    let l = ltr.target.innerText;

    setUsedLetters([...usedLetters, l]);
    let characArray = word.str.split("");
    //console.log(characArray, characArray.includes(l));
    if (characArray.includes(l)) {
      let revealed = word.revealed;
      characArray.forEach((charac, index) => {
        //console.log("charac === l --> ", charac === l, charac, l);
        if (charac === l) {
          revealed[index] = l;
        }
      });
      setWord({ ...word, revealed: revealed });
    } else {
      setWrongGuesses([...wrongGuesses, `${l} `]);
      showBodyPart(bodyParts[wrongGuesses.length], colors.yellow);
    }

    if (wrongGuesses.length > 9 || word.revealed.indexOf("") === -1) {
      setGame({ ...game, over: true });
      // handleEndGame();
      // handleReset();
    }
  };

  const handleReset = () => {
    setGame(GameReset);
    getNewWord();
    setWrongGuesses([]);
    setUsedLetters([]);
    bodyParts.forEach((part) => {
      showBodyPart(part, "transparent");
    });
  };

  return (
    <Wrapper>
      {/* <GameOverModal /> */}
      <Header />
      <Nav>
        <Button
          onClickFunc={game.started === false ? handleStart : handlePause}
        >
          {startBtnDisp}
        </Button>
        <Button onClickFunc={handleReset}>reset</Button>
      </Nav>
      {game.started && (
        <>
          <Container>
            <Deadman />
            <RightColumn>
              <DeadLetters wrongGuesses={wrongGuesses} />
              <TheWord word={word} />
            </RightColumn>
          </Container>
          <Keyboard usedLetters={usedLetters} handleGuess={handleGuess} />
          {game.over && (
            <GameOverModal
              handleReset={handleReset}
              word={word}
              wrongGuesses={wrongGuesses}
            ></GameOverModal>
          )}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${colors.blue};
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  height: 100vh;
  padding: 0 0 64px 0;
`;
const Nav = styled.div`
  max-width: ${contentWidth};
  display: flex;
  height: 80px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${contentWidth};
  min-width: 320px;
  position: relative;
  padding: 20px 0;

  @media (min-width: 600px) {
    flex-direction: row;
  }
`;
const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

export default App;
