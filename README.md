# Text-Video

# 🎬 Prompt-to-Video Generator

A full-stack project that transforms **text prompts** into **AI-generated videos**, powered by a modular architecture consisting of:

- 🧠 **Python Worker** (handles video generation)
- ⚙️ **Express.js Backend** (manages job queue, API routes, and file hosting)
- 💻 **React Frontend (Vite + Tailwind)** (beautiful UI for prompt input and job tracking)

---

## 🧩 Project Overview

The system allows users to input a **text prompt** from the frontend, which triggers a backend job handled by a **Python Worker** that:

1. Generates a video from the prompt using an AI model (e.g., Stable Diffusion / Transformers)
2. Stores the resulting `.mp4` file inside `/public/videos`
3. Notifies the frontend when the video is ready

The frontend automatically updates with a video preview once the generation is complete.

---

## ⚙️ Tech Stack

| Layer                   | Technology                                       |
| :---------------------- | :----------------------------------------------- |
| **Frontend**            | React 18 + Vite + TypeScript + Tailwind CSS      |
| **Backend**             | Express.js                                       |
| **Worker**              | Python (video generation logic + model handling) |
| **Task Queue**          | Redis                                            |
| **Database (optional)** | MongoDB (for logging & job tracking)             |

---

## 🚀 Setup Instructions

### 🔹 1. Clone the repository

```bash
git clone https://github.com/rishab1493/Text-Video.git
cd Text-Video
```

### 🔹 2. Backend Setup

cd Backend
npm install

Create a .env file inside the backend folder:

DB_URL = "mongodb://<Your-Localhost>/project"
PORT = 5000

Run the backend:

npm run dev

### 🔹 3. Setup the Worker

cd Worker
pip install -r requirements.txt

Create a .env inside Worker/:
MONGO_URI = mongodb://<Your-Localhost>/
DATABASE = Database
COLLECTION = Collection name
REDIS_HOST = Redis Host
REDIS_PORT = Redis Port

Run the worker:
python worker.py

### 🔹 4. Setup the Frontend

cd Frontend
npm install

Create a .env inside frontend/:
VITE_BASE_URL = http://localhost:5000

Run the frontend:
npm run dev

### 🔹 5. API Endpoints

| Method | Endpoint                 | Description                     |
| :----- | :----------------------- | :------------------------------ |
| `POST` | `/api/v1/generate-video` | Create new video generation job |
| `GET`  | `/api/v1/getStatus/:id`  | Get current status of a job     |

## 🧠 Worker Details

The Python Worker is the heart of the project — it takes the prompt from the backend, processes it, and generates a short video.

Currently, the worker uses a very basic and lightweight model, which helps keep the generation process simple and fast, but the resulting videos might not look very impressive or realistic.
This is intentional, so the project can run on normal CPUs without heavy GPU requirements.

However, if you have GPU capacity and want higher-quality, more realistic video generation, feel free to modify the worker code to use a more advanced model (for example, Stable Diffusion, ModelScope Text2Video, or any custom diffusion-based pipeline).

How to Improve

1. You can replace the generation logic with:

2. diffusers for Stable Diffusion / ModelScope

3. synthesizervideo for enhanced motion generation

4. Or integrate with APIs like Pika Labs or RunwayML if available

## 🎨 Frontend Features

Clean minimalist UI with Tailwind CSS

Input for text prompt

"Generate Video" button with loading animation

Auto-play video preview on completion

Error handling and friendly messages

## 🤝 Contributing

1. Fork this repository

2. Create a new branch
   git checkout -b feature/new-ui

3. Commit your changes
   git commit -m "Improved frontend design"

4. Push to your branch and open a PR 🚀
