import React, { useState, useEffect } from "react";
import { createTestnetPayment } from "../pi/piAuth";
import "../styles/App.css";

const TicTacToe = ({ user, onLogout }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [betAmount, setBetAmount] = useState(0);
  const [betPlaced, setBetPlaced] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Check for a winner
  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : "Draw";
  };

  // Handle player's move
  const handleMove = (index) => {
    if (board[index] || winner || !betPlaced) return;

    let newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  // Handle computer's move after player's turn
  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);
      return;
    }
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        let available = board.map((v, i) => (v === null ? i : null)).filter(v => v !== null);
        if (available.length > 0) {
          let randomMove = available[Math.floor(Math.random() * available.length)];
          let newBoard = [...board];
          newBoard[randomMove] = "O";
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
      }, 500);
      return () => clearTimeout(timer); // Cleanup to prevent memory leaks
    }
  }, [board, isPlayerTurn, winner]);

  // Place bet before starting game
  const placeBet = async () => {
    if (betAmount <= 0 || betPlaced) return;

    try {
      setPaymentStatus("processing");

      const paymentResult = await createTestnetPayment(
        betAmount,
        "Bet on Tic Tac Toe game",
        null // Recipient handled in `piAuth.js`
      );

      if (paymentResult && paymentResult.status === "COMPLETED") {
        setBetPlaced(true);
        setPaymentStatus("completed");
      } else {
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      setPaymentStatus("failed");
    }
  };

  // Restart the game
  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    setBetPlaced(false);
    setBetAmount(0);
    setPaymentStatus(null);
  };

  return (
    <div className="app-container">
      <h1 className="text-2xl font-bold">Tic Tac Toe Betting Game</h1>

      <div className="user-info">
        <p>Welcome, {user.username || user.uid || "Pi User"}</p>
      </div>

      {!betPlaced ? (
        <div className="betting-panel">
          <h2>Place Your Bet</h2>
          <div className="bet-input">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value))}
              placeholder="Enter bet amount in Pi"
              disabled={paymentStatus === "processing"}
            />
            <button
              onClick={placeBet}
              disabled={betAmount <= 0 || paymentStatus === "processing"}
              className="bet-button"
            >
              {paymentStatus === "processing" ? "Processing..." : "Place Bet"}
            </button>
          </div>
          {paymentStatus === "failed" && (
            <p className="payment-error">Payment failed. Please try again.</p>
          )}
        </div>
      ) : (
        <div className="game-area">
          <p className="bet-info">Bet: {betAmount} Pi</p>

          <div className="board">
            {board.map((cell, index) => (
              <button
                key={index}
                className="cell"
                onClick={() => handleMove(index)}
                disabled={!betPlaced || board[index] || winner || !isPlayerTurn}
              >
                {cell}
              </button>
            ))}
          </div>

          {winner && (
            <div className="winner-panel">
              <p className="winner-text">
                {winner === "Draw"
                  ? "Game ended in a Draw!"
                  : winner === "X"
                  ? "You Won! 🎉"
                  : "Computer Won!"}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="button-container">
        <button className="restart-button" onClick={restartGame}>
          {betPlaced ? "Play Again" : "Reset"}
        </button>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default TicTacToe;
