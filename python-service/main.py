from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from transcription import transcribe_audio
from document_parser import parse_pdf, parse_docx
from google_docs import fetch_google_doc
import os
import tempfile
from typing import Dict, Any

app = FastAPI(title="Minutify Processing Service", version="1.0.0")

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "service": "Minutify Processing Service",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/process/audio")
async def process_audio(file: UploadFile = File(...)):
    """
    Process audio file and return minute-by-minute transcript
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Must be an audio file."
            )

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        try:
            # Transcribe audio with timestamps
            result = transcribe_audio(tmp_path)
            
            return JSONResponse(content={
                "sourceType": "audio",
                "segments": result["segments"],
                "metadata": {
                    "duration": result.get("duration"),
                    "language": result.get("language")
                }
            })
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process/pdf")
async def process_pdf(file: UploadFile = File(...)):
    """
    Process PDF file and return structured sections
    """
    try:
        if not file.filename or not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Must be a PDF file."
            )

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        try:
            # Parse PDF
            result = parse_pdf(tmp_path)
            
            return JSONResponse(content={
                "sourceType": "pdf",
                "segments": result["segments"],
                "metadata": {
                    "pages": result.get("pages"),
                    "filename": file.filename
                }
            })
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process/docx")
async def process_docx(file: UploadFile = File(...)):
    """
    Process DOCX file and return structured sections
    """
    try:
        if not file.filename or not file.filename.endswith('.docx'):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Must be a DOCX file."
            )

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        try:
            # Parse DOCX
            result = parse_docx(tmp_path)
            
            return JSONResponse(content={
                "sourceType": "docx",
                "segments": result["segments"],
                "metadata": {
                    "filename": file.filename
                }
            })
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process/google-docs")
async def process_google_docs(data: Dict[str, str]):
    """
    Fetch and process Google Docs document (read-only)
    """
    try:
        doc_url = data.get("url")
        if not doc_url:
            raise HTTPException(status_code=400, detail="URL is required")

        # Extract document ID from URL
        if "docs.google.com/document/d/" not in doc_url:
            raise HTTPException(
                status_code=400,
                detail="Invalid Google Docs URL"
            )

        # Fetch document content
        result = fetch_google_doc(doc_url)
        
        return JSONResponse(content={
            "sourceType": "gdoc",
            "segments": result["segments"],
            "metadata": {
                "url": doc_url,
                "title": result.get("title")
            }
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
