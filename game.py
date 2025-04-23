from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import uvicorn

app = FastAPI()

# Configure CORS properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # This is important! Allows OPTIONS requests
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

# Add an OPTIONS endpoint to handle preflight requests explicitly
@app.options("/play")
async def options_play():
    return {}

def main():
    uvicorn.run("game:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()