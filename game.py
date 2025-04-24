from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import uvicorn
import os

app = FastAPI()

# Corrected CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://firstgame-zeta.vercel.app"],  # No trailing slash
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

choices = ["rock", "paper", "scissors"]

class PlayerChoice(BaseModel):
    choice: str

@app.post("/play")
def play_game(player: PlayerChoice):
    user_choice = player.choice.lower()
    if user_choice not in choices:
        raise HTTPException(status_code=400, detail="Invalid choice. Choose rock, paper, or scissors.")

    computer_choice = random.choice(choices)

    if user_choice == computer_choice:
        result = "tie"
    elif (user_choice == "rock" and computer_choice == "scissors") or \
         (user_choice == "paper" and computer_choice == "rock") or \
         (user_choice == "scissors" and computer_choice == "paper"):
        result = "you win"
    else:
        result = "you lose"

    return {
        "your_choice": user_choice,
        "computer_choice": computer_choice,
        "result": result
    }

# Optional OPTIONS handler (CORS middleware already handles this)
@app.options("/play")
async def options_play():
    return {}

def main():
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("game:app", host="0.0.0.0", port=port)

if __name__ == "__main__":
    main()
