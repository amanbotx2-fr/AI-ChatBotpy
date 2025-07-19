import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise ValueError("ERROR: GROQ_API_KEY is not set in the environment. Please create a .env file in the root directory with GROQ_API_KEY=your_key")


groq_client = Groq(api_key=api_key)

conversations: dict[str, list[dict[str, str]]] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # This code runs on startup
    print("AI Chatbot API is starting up...")
    yield
    # This code runs on shutdown
    print("AI Chatbot API is shutting down.")

app = FastAPI(
    title="AI Chatbot API",
    description="An API for a simple AI chatbot using FastAPI and Groq.",
    version="1.0.0",
    lifespan=lifespan,
)

# --- CORS Middleware ---
# This allows your React frontend (running on localhost:3000)
# to communicate with your backend (running on localhost:8000)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None

class ChatResponse(BaseModel):
    response: str

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "AI Chatbot API is running"}

@app.post("/chat/", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    if not request.conversation_id:
        raise HTTPException(status_code=400, detail="conversation_id is required.")

    # Get or create the conversation history
    history = conversations.setdefault(
        request.conversation_id,
        [{"role": "system", "content": "You are a helpful and friendly AI assistant."}],
    )

    # Add the new user message to the history
    history.append({"role": "user", "content": request.message})

    try:
        # Use the globally initialized Groq client
        chat_completion = groq_client.chat.completions.create(
            messages=history,  # Send the entire conversation history
            model="llama3-8b-8192",
        )
        ai_response = chat_completion.choices[0].message.content

        # Add the AI's response to the history for future context
        history.append({"role": "assistant", "content": ai_response})
        return ChatResponse(response=ai_response)
    except Exception as e:
        # This will catch other errors from the Groq API, like an invalid key
        raise HTTPException(status_code=500, detail=str(e))