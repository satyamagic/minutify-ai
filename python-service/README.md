# Minutify Python Processing Service

Python microservice for processing audio and document files.

## Features

- **Audio Transcription**: OpenAI Whisper with minute-by-minute timestamps
- **PDF Parsing**: Extract and structure PDF content
- **DOCX Parsing**: Extract and structure Word documents
- **Google Docs**: Fetch public Google Docs (read-only)

## Setup

### 1. Create Virtual Environment

```bash
cd python-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note**: Installing Whisper will also install PyTorch, which is a large download (~2GB).

### 3. Install System Dependencies

For audio processing, you may need ffmpeg:

```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### 4. Run the Service

```bash
python main.py
```

The service will start on `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```

### Process Audio
```
POST /process/audio
Content-Type: multipart/form-data

file: <audio file>
```

Returns minute-by-minute transcript with timestamps.

### Process PDF
```
POST /process/pdf
Content-Type: multipart/form-data

file: <pdf file>
```

Returns structured sections from PDF.

### Process DOCX
```
POST /process/docx
Content-Type: multipart/form-data

file: <docx file>
```

Returns structured sections from Word document.

### Process Google Docs
```
POST /process/google-docs
Content-Type: application/json

{
  "url": "https://docs.google.com/document/d/..."
}
```

Returns content from publicly accessible Google Doc.

## Response Format

All processing endpoints return data in the unified format:

```json
{
  "sourceType": "audio|pdf|docx|gdoc",
  "segments": [
    {
      "index": 0,
      "minute": 0,
      "title": null,
      "content": "transcribed or parsed text"
    }
  ],
  "metadata": {
    // Additional metadata specific to source type
  }
}
```

## Development

### Testing Endpoints

```bash
# Test health check
curl http://localhost:8000/health

# Test audio transcription
curl -X POST http://localhost:8000/process/audio \
  -F "file=@test-audio.mp3"

# Test PDF parsing
curl -X POST http://localhost:8000/process/pdf \
  -F "file=@test-document.pdf"
```

### Docker Deployment (Optional)

```bash
docker build -t minutify-python-service .
docker run -p 8000:8000 minutify-python-service
```

## Performance Notes

- **Whisper Model**: Using "base" model for balance of speed/accuracy
  - Tiny: Fastest, least accurate
  - Base: Good balance (recommended)
  - Small/Medium: Better accuracy, slower
  - Large: Best accuracy, very slow

- **Processing Time**:
  - Audio: ~1-2x real-time (1 minute audio = 1-2 minutes processing)
  - PDF: Nearly instant
  - DOCX: Nearly instant
  - Google Docs: Depends on network + document size

## Security Notes

- Service should run behind firewall or with API authentication
- File uploads are stored temporarily and deleted after processing
- Google Docs integration only works with public documents
- For production, implement rate limiting and file size restrictions

## Troubleshooting

### "ffmpeg not found"
Install ffmpeg using your system package manager.

### "CUDA out of memory"
Whisper will use GPU if available. To force CPU:
```python
model = whisper.load_model("base", device="cpu")
```

### Slow transcription
Use a smaller Whisper model (e.g., "tiny" instead of "base").

## License

MIT
