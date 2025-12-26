import requests
import re
from typing import Dict, List, Any


def extract_doc_id(url: str) -> str:
    """Extract document ID from Google Docs URL"""
    # Pattern: https://docs.google.com/document/d/{DOC_ID}/...
    match = re.search(r'/document/d/([a-zA-Z0-9-_]+)', url)
    if match:
        return match.group(1)
    raise ValueError("Could not extract document ID from URL")


def fetch_google_doc(doc_url: str) -> Dict[str, Any]:
    """
    Fetch Google Docs content (read-only, public documents only)
    
    This implementation uses the public export feature which works
    for documents that are publicly accessible.
    
    Args:
        doc_url: Google Docs URL
        
    Returns:
        Dict containing segments from the document
    """
    try:
        # Extract document ID
        doc_id = extract_doc_id(doc_url)
        
        # Use Google Docs export API (works for public documents)
        export_url = f"https://docs.google.com/document/d/{doc_id}/export?format=txt"
        
        # Fetch document as plain text
        response = requests.get(export_url, timeout=30)
        
        if response.status_code == 404:
            raise Exception("Document not found or not publicly accessible")
        elif response.status_code != 200:
            raise Exception(f"Failed to fetch document: HTTP {response.status_code}")
        
        content = response.text.strip()
        
        # Split content into logical sections
        # Simple approach: split by double newlines or detect headings
        segments = []
        lines = content.split('\n')
        current_section = []
        current_title = None
        
        for line in lines:
            line = line.strip()
            
            if not line:
                # Empty line might indicate section break
                if current_section:
                    segments.append({
                        "index": len(segments),
                        "minute": None,
                        "title": current_title,
                        "content": "\n".join(current_section)
                    })
                    current_section = []
                    current_title = None
                continue
            
            # Simple heuristic: short lines might be headings
            if len(line) < 100 and len(current_section) == 0:
                current_title = line
            else:
                current_section.append(line)
        
        # Add remaining content
        if current_section:
            segments.append({
                "index": len(segments),
                "minute": None,
                "title": current_title,
                "content": "\n".join(current_section)
            })
        
        # If no sections were detected, create one section
        if not segments:
            segments.append({
                "index": 0,
                "minute": None,
                "title": "Document Content",
                "content": content
            })
        
        return {
            "segments": segments,
            "title": "Google Docs Import"
        }
        
    except Exception as e:
        raise Exception(f"Google Docs fetch failed: {str(e)}")


# Note: For production use with private documents, you would need to:
# 1. Set up Google Cloud Project
# 2. Enable Google Docs API
# 3. Implement OAuth 2.0 authentication
# 4. Use google-api-python-client library
# 
# The current implementation only works for publicly accessible documents
# and doesn't require API credentials, making it suitable for demonstration.
