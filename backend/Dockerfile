# Backend image: FastAPI deal engine + Deal Engine MCP server.
# Built from the repository root so `backend/` stays an importable package:
#   docker build -f backend/Dockerfile -t ai-sales-backend .
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend

# Railway (and most PaaS) inject PORT. Bind 0.0.0.0 so the platform can route
# to the container, and keep a sane local default.
ENV PORT=8000
EXPOSE 8000

# Agora's cloud calls /mcp on this service, so it must be publicly reachable.
CMD ["sh", "-c", "uvicorn backend.server:app --host 0.0.0.0 --port ${PORT}"]
