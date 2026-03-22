from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Topic
from app.schemas import TopicCategory, TopicCreate, TopicRead, TopicSummary, TopicUpdate

router = APIRouter(prefix="/api/topics", tags=["topics"])


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
def create_topic(payload: TopicCreate, db: Session = Depends(get_db)):
    if db.query(Topic).filter(Topic.slug == payload.slug).first():
        raise HTTPException(status_code=409, detail="Slug already exists")
    topic = Topic(**payload.model_dump())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


@router.patch("/{slug}", response_model=TopicRead)
def update_topic(slug: str, payload: TopicUpdate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.slug == slug).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(topic, field, value)
    db.commit()
    db.refresh(topic)
    return topic


@router.delete("/{slug}", status_code=204)
def delete_topic(slug: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.slug == slug).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    db.delete(topic)
    db.commit()
