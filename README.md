# Hack Brain – AI-powered Study Assistant Chatbot

![Main Page Screenshot](/docs/main_page_screenshot.png)

> ⚠️ This project is currently in **active development**, but a **testable version** is already available. Contributions, feedback, and suggestions are welcome!

**Hack Brain** is an **AI-powered study assistant** designed to help students **organize their learning materials** and **study more efficiently**. The project leverages a **custom Retrieval-Augmented Generation (RAG) pipeline**, allowing users to upload and manage their own study resources such as **books, articles, notes, and text documents**.  

With this approach, the chatbot can provide **personalized answers** and assist in creating a more **structured and adaptive study process**.

---

## Features

- **AI Chatbot** powered by Gemini for intelligent responses.  
- **Custom content ingestion** – add your own books, notes, articles, or any text.  
- **Semantic search** using Pinecone as the vector database.  
- **RAG pipeline** tailored for efficient knowledge retrieval.  
- Built with **Next.js** for a modern and scalable web experience.  

---

## Tech Stack

- **Frontend & Backend**: [Next.js](https://nextjs.org/)  
- **AI Model**: [Gemini API](https://ai.google.dev/)  
- **Vector Database**: [Pinecone](https://www.pinecone.io/)  

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
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

### 4. Run the development server
```bash
npm run dev
```

Visit **http://localhost:3000** to start using Hack Brain.  
