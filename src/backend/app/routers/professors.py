from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import verify_admin
from app.database import get_db
from app.models import AdminUser, Course, Professor, Topic
from app.schemas import ProfessorCreate, ProfessorRead, ProfessorSummary, ProfessorUpdate

router = APIRouter(prefix="/api/professors", tags=["professors"])


def _apply_relationships(professor: Professor, payload, db: Session) -> None:
    if payload.course_ids is not None:
        professor.courses = db.query(Course).filter(Course.id.in_(payload.course_ids)).all()
    if payload.topic_ids is not None:
        professor.topics = db.query(Topic).filter(Topic.id.in_(payload.topic_ids)).all()


@router.get("", response_model=list[ProfessorSummary])
def list_professors(db: Session = Depends(get_db)):
    return db.query(Professor).order_by(Professor.full_name).all()


@router.get("/{professor_id}", response_model=ProfessorRead)
def get_professor(professor_id: int, db: Session = Depends(get_db)):
    professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    return professor


@router.post("", response_model=ProfessorRead, status_code=201)
def create_professor(
    payload: ProfessorCreate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    professor = Professor(**payload.model_dump(exclude={"course_ids", "topic_ids"}))
    db.add(professor)
    db.flush()
    _apply_relationships(professor, payload, db)
    db.commit()
    db.refresh(professor)
    return professor


@router.patch("/{professor_id}", response_model=ProfessorRead)
def update_professor(
    professor_id: int,
    payload: ProfessorUpdate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    for field, value in payload.model_dump(
        exclude_unset=True, exclude={"course_ids", "topic_ids"}
    ).items():
        setattr(professor, field, value)
    _apply_relationships(professor, payload, db)
    db.commit()
    db.refresh(professor)
    return professor


@router.delete("/{professor_id}", status_code=204)
def delete_professor(
    professor_id: int,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    professor = db.query(Professor).filter(Professor.id == professor_id).first()
    if professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    db.delete(professor)
    db.commit()
