from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Course
from app.schemas import CourseCategoryTag, CourseCreate, CourseRead, CourseSummary, CourseUpdate

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("", response_model=list[CourseSummary])
def list_courses(
    category_tag: CourseCategoryTag | None = Query(default=None),
    db: Session = Depends(get_db),
):
    q = db.query(Course)
    if category_tag is not None:
        # category_tag is stored as a JSON array; filter rows containing the value
        q = q.filter(Course.category_tag.contains([category_tag.value]))
    return q.order_by(Course.course_program, Course.course_code).all()


@router.get("/{course_id}", response_model=CourseRead)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("", response_model=CourseRead, status_code=201)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    course = Course(**payload.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.patch("/{course_id}", response_model=CourseRead)
def update_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=204)
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
