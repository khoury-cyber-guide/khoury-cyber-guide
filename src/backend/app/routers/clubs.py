from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import verify_admin
from app.database import get_db
from app.models import AdminUser, Club, Topic
from app.schemas import ClubCreate, ClubRead, ClubSummary, ClubUpdate

router = APIRouter(prefix="/api/clubs", tags=["clubs"])


def _apply_relationships(club: Club, payload, db: Session) -> None:
    if payload.topic_ids is not None:
        club.topics = db.query(Topic).filter(Topic.id.in_(payload.topic_ids)).all()


@router.get("", response_model=list[ClubSummary])
def list_clubs(db: Session = Depends(get_db)):
    return db.query(Club).order_by(Club.name).all()


@router.get("/{club_id}", response_model=ClubRead)
def get_club(club_id: int, db: Session = Depends(get_db)):
    club = db.query(Club).filter(Club.id == club_id).first()
    if club is None:
        raise HTTPException(status_code=404, detail="Club not found")
    return club


@router.post("", response_model=ClubRead, status_code=201)
def create_club(
    payload: ClubCreate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    club = Club(**payload.model_dump(exclude={"topic_ids"}))
    db.add(club)
    db.flush()
    _apply_relationships(club, payload, db)
    db.commit()
    db.refresh(club)
    return club


@router.patch("/{club_id}", response_model=ClubRead)
def update_club(
    club_id: int,
    payload: ClubUpdate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    club = db.query(Club).filter(Club.id == club_id).first()
    if club is None:
        raise HTTPException(status_code=404, detail="Club not found")
    for field, value in payload.model_dump(exclude_unset=True, exclude={"topic_ids"}).items():
        setattr(club, field, value)
    _apply_relationships(club, payload, db)
    db.commit()
    db.refresh(club)
    return club


@router.delete("/{club_id}", status_code=204)
def delete_club(
    club_id: int,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    club = db.query(Club).filter(Club.id == club_id).first()
    if club is None:
        raise HTTPException(status_code=404, detail="Club not found")
    db.delete(club)
    db.commit()
