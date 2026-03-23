import hmac
import hashlib
import os

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AdminUser

_bearer = HTTPBearer()


def _hash_token(token: str) -> str:
    pepper = os.getenv("ADMIN_TOKEN_PEPPER", "")
    return hmac.new(pepper.encode(), token.encode(), hashlib.sha256).hexdigest()


def verify_admin(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
    db: Session = Depends(get_db),
) -> AdminUser:
    token_hash = _hash_token(creds.credentials)
    user = (
        db.query(AdminUser)
        .filter(AdminUser.token_hash == token_hash, AdminUser.is_active == True)
        .first()
    )
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return user
