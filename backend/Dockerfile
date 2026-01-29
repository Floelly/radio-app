FROM python:3.12-slim

# System-Dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Requirements
RUN pip install --no-cache-dir fastapi uvicorn[standard] "pydantic>=2" "PyJWT>=2" email-validator

COPY app.py /app/app.py
COPY covers/ /app/covers/

EXPOSE 8080

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]