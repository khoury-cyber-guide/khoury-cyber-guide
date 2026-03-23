"""
Usage:
  python scripts/create_admin.py <name> <email>

Generates a personal access token for a new admin user and stores
the HMAC-SHA256 hash in the database. The raw token is printed once —
share it with the user via a secure channel (Signal, encrypted email, etc.).
"""
import hmac
import hashlib
import os
import secrets
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv

load_dotenv()

from app.database import SessionLocal, engine
from app.models import AdminUser, Base

_ALLOWED_DOMAIN = "northeastern.edu"
_ALLOWED_EXACT = {"khourycyber@gmail.com"}


def _email_allowed(email: str) -> bool:
    e = email.strip().lower()
    return e in _ALLOWED_EXACT or e.endswith(f"@{_ALLOWED_DOMAIN}")


def _hash_token(token: str) -> str:
    pepper = os.getenv("ADMIN_TOKEN_PEPPER", "")
    return hmac.new(pepper.encode(), token.encode(), hashlib.sha256).hexdigest()


def create_admin(name: str, email: str) -> None:
    email = email.strip().lower()

    if not _email_allowed(email):
        print(f"Error: '{email}' is not an allowed email address.")
        sys.exit(1)

    Base.metadata.create_all(bind=engine)

    token = secrets.token_hex(32)
    token_hash = _hash_token(token)

    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter(AdminUser.email == email).first()
        if existing:
            existing.token_hash = token_hash
            existing.is_active = True
            action = "regenerated"
        else:
            db.add(AdminUser(name=name, email=email, token_hash=token_hash))
            action = "created"
        db.commit()
    finally:
        db.close()

    print(f"\nAdmin user {action}: {name} <{email}>")
    print(f"\nPersonal access token (shown once — share via secure channel):")
    print(f"\n  {token}\n")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python scripts/create_admin.py <name> <email>")
        sys.exit(1)
    create_admin(sys.argv[1], sys.argv[2])
