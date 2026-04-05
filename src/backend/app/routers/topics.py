from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.auth import verify_admin
from app.database import get_db
from app.models import AdminUser, Club, Course, KhouryResource, Professor, Topic
from app.schemas import TopicCategory, TopicCreate, TopicRead, TopicSummary, TopicUpdate

router = APIRouter(prefix="/api/topics", tags=["topics"])


def _apply_relationships(topic: Topic, payload, db: Session) -> None:
    if payload.course_ids is not None:
        topic.courses = db.query(Course).filter(Course.id.in_(payload.course_ids)).all()
    if payload.club_ids is not None:
        topic.clubs = db.query(Club).filter(Club.id.in_(payload.club_ids)).all()
    if payload.khoury_resource_ids is not None:
        topic.khoury_resources = db.query(KhouryResource).filter(KhouryResource.id.in_(payload.khoury_resource_ids)).all()
    if payload.professor_ids is not None:
        topic.professors = db.query(Professor).filter(Professor.id.in_(payload.professor_ids)).all()


@router.get("", response_model=list[TopicSummary])
def list_topics(
    category: TopicCategory | None = Query(default=None),
    db: Session = Depends(get_db),
):
    q = db.query(Topic)
    if category is not None:
        q = q.filter(Topic.category == category)
    return q.order_by(Topic.category, Topic.order).all()


@router.get("/{slug}", response_model=TopicRead)
def get_topic(slug: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.slug == slug).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@router.post("", response_model=TopicRead, status_code=201)
def create_topic(
    payload: TopicCreate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    if db.query(Topic).filter(Topic.slug == payload.slug).first():
        raise HTTPException(status_code=409, detail="Slug already exists")
    if db.query(Topic).filter(Topic.title == payload.title).first():
        raise HTTPException(status_code=409, detail="A topic with that title already exists")
    topic = Topic(**payload.model_dump(mode='json', exclude={"course_ids", "club_ids", "khoury_resource_ids", "professor_ids"}))
    db.add(topic)
    db.flush()
    _apply_relationships(topic, payload, db)
    db.commit()
    db.refresh(topic)
    return topic


@router.patch("/{slug}", response_model=TopicRead)
def update_topic(
    slug: str,
    payload: TopicUpdate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    topic = db.query(Topic).filter(Topic.slug == slug).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    for field, value in payload.model_dump(
        mode='json', exclude_unset=True, exclude={"course_ids", "club_ids", "khoury_resource_ids", "professor_ids"}
    ).items():
        setattr(topic, field, value)
    _apply_relationships(topic, payload, db)
    db.commit()
    db.refresh(topic)
    return topic


@router.delete("/{slug}", status_code=204)
def delete_topic(
    slug: str,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    topic = db.query(Topic).filter(Topic.slug == slug).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    db.delete(topic)
    db.commit()
