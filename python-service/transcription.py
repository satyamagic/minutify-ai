import whisper
import math
from typing import Dict, List, Any


def transcribe_audio(audio_path: str) -> Dict[str, Any]:
    """
    Transcribe audio file using OpenAI Whisper with minute-by-minute timestamps
    
    Args:
        audio_path: Path to the audio file
        
    Returns:
        Dict containing segments with minute-level timestamps
    """
    try:
        # Load Whisper model (base model for balance of speed/accuracy)
        # Options: tiny, base, small, medium, large
        model = whisper.load_model("base")
        
        # Transcribe with word-level timestamps
        result = model.transcribe(
            audio_path,
            word_timestamps=True,
            verbose=False
        )
        
        # Group segments by minute
        segments = []
        current_minute = 0
        minute_text = []
        
        for segment in result["segments"]:
            start_time = segment["start"]
            text = segment["text"].strip()
            
            # Determine which minute this segment belongs to
            segment_minute = math.floor(start_time / 60)
            
            # If we've moved to a new minute, save the previous minute
            if segment_minute > current_minute and minute_text:
                segments.append({
                    "index": len(segments),
                    "minute": current_minute,
                    "title": None,
                    "content": " ".join(minute_text)
                })
                minute_text = []
                current_minute = segment_minute
            
            minute_text.append(text)
        
        # Add the last minute
        if minute_text:
            segments.append({
                "index": len(segments),
                "minute": current_minute,
                "title": None,
                "content": " ".join(minute_text)
            })
        
        return {
            "segments": segments,
            "duration": result.get("duration", 0),
            "language": result.get("language", "unknown")
        }
        
    except Exception as e:
        raise Exception(f"Transcription failed: {str(e)}")


def format_timestamp(seconds: float) -> str:
    """Format seconds into MM:SS"""
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes:02d}:{secs:02d}"
