import uvicorn

from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.app:start_app", host=settings.HOST, port=settings.PORT, factory=True
    )
