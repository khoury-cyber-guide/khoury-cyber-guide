from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Session

from app.auth import verify_admin
from app.database import get_db
from app.models import AdminUser, Course, Professor
from app.schemas import CourseCategoryTag, CourseCreate, CourseRead, CourseSummary, CourseUpdate

router = APIRouter(prefix="/api/courses", tags=["courses"])


def _apply_relationships(course: Course, payload, db: Session) -> None:
    if payload.prereq_ids is not None:
        course.prereqs = db.query(Course).filter(Course.id.in_(payload.prereq_ids)).all()
    if payload.professor_ids is not None:
        course.past_professors = db.query(Professor).filter(Professor.id.in_(payload.professor_ids)).all()


@router.get("", response_model=list[CourseSummary])
def list_courses(
    category_tag: CourseCategoryTag | None = Query(default=None),
    db: Session = Depends(get_db),
):
    q = db.query(Course)
    if category_tag is not None:
        q = q.filter(cast(Course.category_tag, JSONB).contains([category_tag.value]))
    return q.order_by(Course.course_program, Course.course_code).all()


@router.get("/{course_id}", response_model=CourseRead)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("", response_model=CourseRead, status_code=201)
def create_course(
    payload: CourseCreate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    course = Course(**payload.model_dump(exclude={"prereq_ids", "professor_ids"}))
    db.add(course)
    db.flush()
    _apply_relationships(course, payload, db)
    db.commit()
    db.refresh(course)
    return course


@router.patch("/{course_id}", response_model=CourseRead)
def update_course(
    course_id: int,
    payload: CourseUpdate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    for field, value in payload.model_dump(
        exclude_unset=True, exclude={"prereq_ids", "professor_ids"}
    ).items():
        setattr(course, field, value)
    _apply_relationships(course, payload, db)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=204)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
