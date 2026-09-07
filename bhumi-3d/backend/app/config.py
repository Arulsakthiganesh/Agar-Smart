import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "BHUMI 3D - 3D ULPIN & Vertical Property Intelligence Platform"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    SECRET_KEY: str = "bhumi3d_sih2026_secure_secret_key_super_secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "sqlite:///./bhumi3d.db"
    
    class Config:
        env_file = ".env"

settings = Settings()
