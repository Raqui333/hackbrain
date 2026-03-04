# Hack Brain – AI-powered Study Assistant Chatbot

**Hack Brain** is an **AI-powered study assistant** designed to help students **organize their learning materials** and **study more efficiently**.

The project leverages a **custom Retrieval-Augmented Generation (RAG) pipeline** combined with **LangGraph orchestration**, enabling automated reasoning workflows and more reliable responses.

Users can upload and manage their own study resources such as **books, articles, notes, and text documents**, allowing the chatbot to generate **context-aware and personalized answers**.

![Main Page Screenshot](/docs/main_page_screenshot.png)
![Usage Screenshot](/docs/usage_screenshot.png)

> ⚠️ This project is currently in **active development**, but a **testable version** is already available. Contributions, feedback, and suggestions are welcome!

---

## Features

- **AI Chatbot with multi-model support**
  - OpenAI
  - Google (Gemini)
  - Local models via Ollama
- **LangGraph-powered agent orchestration** for structured reasoning and automated workflows
- **Custom content ingestion** – upload books, notes, articles, or text files
- **Semantic search** powered by Pinecone
- **Custom RAG pipeline** optimized for study material retrieval
- **Modern fullstack architecture with Next.js**

---

# Tech Stack

**Framework**
- [Next.js](https://nextjs.org/)

**AI & Agent Orchestration**
- [LangGraph](https://www.langchain.com/langgraph)
- OpenAI
- Google Gemini
- Ollama (local models)

**Vector Database**
- [Pinecone](https://www.pinecone.io/) 

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Raqui333/hackbrain.git
cd hackbrain
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables  
Create a `.env` file in the root directory and add the following:

```env
## Environment Variables
GOOGLE_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here

## Models
OLLAMA_MODEL="gemma3:1b"
OPENAI_MODEL="gpt-4o-mini"
GOOGLE_MODEL="gemini-2.5-flash"

DEFAULT_MODEL="gpt-4o-mini"

## Embeddings
OLLAMA_EMBEDDING_MODEL="embeddinggemma"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"

DEFAULT_EMBEDDING_MODEL="text-embedding-3-small"

## Pinecone
PINECONE_API_KEY=your_pinecone_key_here
PINECONE_INDEX_NAME=your_pinecone_index_name_here

## Tavily
TAVILY_API_KEY=your_travily_key_here
```

> Obs: Some local models, such as gemma3:1b, do not support tool calls. Keep this in mind when choosing a local model.

### 4. Run the development server
```bash
npm run dev
```

Visit **http://localhost:3000** to start using Hack Brain.  
