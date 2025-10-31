const board = document.getElementById("board");
    const scoreXEl = document.getElementById("scoreX");
    const scoreOEl = document.getElementById("scoreO");
    const newGameBtn = document.getElementById("newGameBtn");
    const resetBtn = document.getElementById("resetBtn");
    const modeBtn = document.getElementById("modeBtn");
    const soundBtn = document.getElementById("soundBtn");
    const trophy = document.getElementById("trophy");

    let cells = [];
    let currentPlayer = "X";
    let vsComputer = false;
    let scoreX = 0, scoreO = 0;
    let soundEnabled = true;
    let gameOver = false;
    let confettiInterval = null;

    const clickSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3");
    const winSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-winning-notification-2018.mp3");
    const drawSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.mp3");

    function playSound(sound) {
      if (soundEnabled) sound.play();
    }

    function createBoard() {
      board.innerHTML = "";
      cells = [];
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => makeMove(i));
        board.appendChild(cell);
        cells.push(cell);
      }
      gameOver = false;
      hideTrophy();
      stopConfetti();
    }

    function makeMove(i) {
      if (cells[i].textContent || gameOver) return;
      playSound(clickSound);
      cells[i].textContent = currentPlayer;

      if (checkWin()) {
        handleWin(currentPlayer);
        return;
      }

      if (cells.every(c => c.textContent)) {
        handleDraw();
        return;
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";

      if (vsComputer && currentPlayer === "O") {
        setTimeout(computerMove, 500);
      }
    }

    function computerMove() {
      const emptyCells = cells.map((c, i) => (c.textContent ? null : i)).filter(i => i !== null);
      const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      makeMove(move);
    }

    function checkWin() {
      const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      return wins.find(([a,b,c]) => 
        cells[a].textContent && 
        cells[a].textContent === cells[b].textContent && 
        cells[a].textContent === cells[c].textContent
      );
    }

    function handleWin(player) {
      gameOver = true;
      playSound(winSound);
      const winCombo = checkWin();
      winCombo.forEach(i => cells[i].classList.add("winner"));

      if (player === "X") scoreX++; else scoreO++;
      scoreXEl.textContent = scoreX;
      scoreOEl.textContent = scoreO;

      showTrophy();
      startConfetti(player);
    }

    function handleDraw() {
      playSound(drawSound);
      alert("It's a Draw!");
      gameOver = true;
    }

    function showTrophy() {
      trophy.style.opacity = 1;
      trophy.style.transform = "translate(-50%, -50%) scale(1)";
      trophy.classList.add("show-trophy");
    }

    function hideTrophy() {
      trophy.classList.remove("show-trophy");
      trophy.style.opacity = 0;
      trophy.style.transform = "translate(-50%, -50%) scale(0)";
    }

    function startConfetti(player) {
      stopConfetti();
      confettiInterval = setInterval(() => {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: player === "X" ? ['#0047ab','#00bfff'] : ['#ff4757','#ffa502']
        });
      }, 4000);
    }

    function stopConfetti() {
      if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
      }
    }

    function newGame() {
      createBoard();
      currentPlayer = "X";
      gameOver = false;
    }

    function resetScores() {
      scoreX = 0; scoreO = 0;
      scoreXEl.textContent = 0;
      scoreOEl.textContent = 0;
      newGame();
    }

    newGameBtn.onclick = newGame;
    resetBtn.onclick = resetScores;
    modeBtn.onclick = () => {
      vsComputer = !vsComputer;
      modeBtn.textContent = vsComputer ? "Play vs Player" : "Play vs Computer";
      newGame();
    };
    soundBtn.onclick = () => {
      soundEnabled = !soundEnabled;
      soundBtn.textContent = soundEnabled ? "🔊 Sound" : "🔇 Muted";
      soundBtn.classList.toggle("muted");
    };

    createBoard();