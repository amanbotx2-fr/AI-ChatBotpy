# AI Chatbot (FastAPI + React + Groq)

This is a full-stack AI chatbot application. The backend is built with Python and FastAPI, using the Groq API for fast AI responses. The frontend is a modern, responsive chat interface built with React and Tailwind CSS.

## Features

- **FastAPI Backend**: A robust and fast Python web framework.
- **Groq Integration**: Leverages the Groq LPU Inference Engine for real-time AI responses from models like Llama 3.
- **React Frontend**: A dynamic and interactive user interface built with Vite and React.
- **Tailwind CSS**: A utility-first CSS framework for beautiful, responsive design.
- **Conversation History**: Remembers the context of the current conversation (in-memory).
- **Easy Setup**: Ready to run with minimal configuration.

## Project Structure

```
.
├── frontend/
│   └── chatbotui/      # React frontend application
├── main.py             # FastAPI backend application
├── requirements.txt    # Backend Python dependencies
├── .env.example        # Backend environment variables template
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- [Python](https://www.python.org/downloads/) 3.9+
- [Node.js](https://nodejs.org/) 16.x or higher (which includes `npm`)

## Setup and Running the Application

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup (FastAPI)

Navigate to the project root directory if you aren't already there.

**a. Create and activate a virtual environment:**

```bash
# For Windows
python -m venv venv
.\venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

**b. Install Python dependencies:**

```bash
pip install -r requirements.txt
```

**c. Configure environment variables:**

Create a `.env` file in the root directory by copying the example file:

```bash
# For Windows:
copy .env.example .env
# For macOS/Linux:
cp .env.example .env
```

Now, open the newly created `.env` file and add your Groq API key. You can get a free key from the Groq Console.

```env
# .env
GROQ_API_KEY="YOUR_GROQ_API_KEY_HERE"
```

**d. Run the backend server:**

```bash
uvicorn main:app --reload
```

The backend API will be running at `http://127.0.0.1:8000`. You can see the API documentation at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup (React)

Open a new terminal and navigate to the frontend directory.

**a. Go to the frontend directory:**

```bash
cd frontend/chatbotui
```

**b. Install Node.js dependencies:**

```bash
npm install
```

**c. Run the frontend development server:**

The frontend is pre-configured to connect to the backend at `http://localhost:8000`. No extra steps are needed.

```bash
npm run dev
```

The React application will be available at `http://localhost:3000` (or another port if 3000 is busy). Open this URL in your browser to start chatting!

## Future Improvements

- **Persistent Storage**: The current conversation history is stored in-memory and will be lost if the server restarts. This could be replaced with a database like SQLite or Redis.
- **Streaming Responses**: Implement streaming (Server-Sent Events) to show the AI's response token-by-token for a more interactive "typing" effect.
