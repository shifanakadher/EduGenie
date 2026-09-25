from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai_service import generate_response
from database import create_tables, save_history, get_history
# =========================================================
# FastAPI Application
# =========================================================

app = FastAPI(
    title="EduGenie API",
    description="AI-powered educational assistant",
    version="1.0.0",
)


# =========================================================
# CORS Configuration
# =========================================================

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://edugenie-frontend-9jmt.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Database Setup
# =========================================================

create_tables()


# =========================================================
# Request Models
# =========================================================

class QuestionRequest(BaseModel):
    question: str


class ExplainRequest(BaseModel):
    topic: str


class QuizRequest(BaseModel):
    topic: str


class SummarizeRequest(BaseModel):
    text: str


class LearningPathRequest(BaseModel):
    topic: str


# =========================================================
# Home
# =========================================================

@app.get("/")
def home():

    return {
        "message": "Welcome to EduGenie!"
    }


# =========================================================
# Health Check
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# =========================================================
# Ask Question
# =========================================================

@app.post("/ask")
def ask_ai(request: QuestionRequest):

    answer = generate_response(
        f"""
You are EduGenie, an AI educational assistant.

Answer the student's question clearly and accurately.
Keep the answer concise and easy to understand.

Student question:
{request.question}
"""
    )

    save_history(
        "ask",
        request.question,
        answer
    )

    return {
        "question": request.question,
        "answer": answer
    }


# =========================================================
# Explain Concept
# =========================================================

@app.post("/explain")
def explain_concept(request: ExplainRequest):

    explanation = generate_response(
        f"""
You are EduGenie, an AI educational assistant.

Explain the following concept in a very simple and beginner-friendly way.

Requirements:
- Use simple language.
- Give a short definition.
- Explain the main idea clearly.
- Give one easy example.
- Avoid unnecessary technical terms.

Concept:
{request.topic}
"""
    )

    save_history(
        "explain",
        request.topic,
        explanation
    )

    return {
        "topic": request.topic,
        "explanation": explanation
    }


# =========================================================
# Generate Quiz
# =========================================================

@app.post("/quiz")
def generate_quiz(request: QuizRequest):

    quiz = generate_response(
        f"""
You are EduGenie, an AI educational assistant.

Create a quiz about the following topic:

Topic:
{request.topic}

Generate exactly 5 multiple-choice questions.

For each question:
- Give 4 options labeled A, B, C, and D.
- Give the correct answer.
- Give a short explanation of why the answer is correct.

Use this format:

Question 1: [question]

A. [option]
B. [option]
C. [option]
D. [option]

Correct Answer: [letter and answer]

Explanation: [short explanation]

Repeat the same format for Questions 2, 3, 4, and 5.

Keep the questions educational and suitable for a student.
"""
    )

    save_history(
        "quiz",
        request.topic,
        quiz
    )

    return {
        "topic": request.topic,
        "quiz": quiz
    }


# =========================================================
# Summarize Text
# =========================================================

@app.post("/summarize")
def summarize_text(request: SummarizeRequest):

    summary = generate_response(
        f"""
You are EduGenie, an AI educational assistant.

Summarize the following educational text.

Requirements:
- Keep the summary concise.
- Include the most important points.
- Use simple and clear language.
- Do not add information that is not present in the original text.
- Use bullet points when helpful.

Educational text:
{request.text}
"""
    )

    save_history(
        "summarize",
        request.text,
        summary
    )

    return {
        "summary": summary
    }


# =========================================================
# Learning Path
# =========================================================

@app.post("/learning-path")
def create_learning_path(request: LearningPathRequest):

    learning_path = generate_response(
        f"""
You are EduGenie, an AI educational assistant.

Create a structured learning path for the following topic:

Topic:
{request.topic}

The learning path should be suitable for a beginner who wants to gradually reach an advanced level.

Include:

1. Beginner level
2. Intermediate level
3. Advanced level
4. Important topics to learn at each level
5. Suggested timeline
6. Practice suggestions
7. Recommended next steps

Use clear headings and bullet points.
Keep the learning path practical and easy to follow.
"""
    )

    save_history(
        "learning-path",
        request.topic,
        learning_path
    )

    return {
        "topic": request.topic,
        "learning_path": learning_path
    }


# =========================================================
# Learning History
# =========================================================

@app.get("/history")
def history():

    records = get_history()

    return {
        "history": records
    }