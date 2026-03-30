from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import verify_admin
from app.database import get_db
from app.models import AdminUser, KhouryResource
from app.schemas import (
    KhouryResourceCreate,
    KhouryResourceRead,
    KhouryResourceSummary,
    KhouryResourceUpdate,
)

router = APIRouter(prefix="/api/khoury-resources", tags=["khoury-resources"])


@router.get("", response_model=list[KhouryResourceSummary])
def list_khoury_resources(
    category: str | None = None,
    is_featured: bool | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(KhouryResource)
    if category is not None:
        q = q.filter(KhouryResource.category == category)
    if is_featured is not None:
        q = q.filter(KhouryResource.is_featured == is_featured)
    return q.order_by(KhouryResource.priority, KhouryResource.name).all()


@router.get("/{resource_id}", response_model=KhouryResourceRead)
def get_khoury_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(KhouryResource).filter(KhouryResource.id == resource_id).first()
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.post("", response_model=KhouryResourceRead, status_code=201)
def create_khoury_resource(
    payload: KhouryResourceCreate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    resource = KhouryResource(**payload.model_dump())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource


@router.patch("/{resource_id}", response_model=KhouryResourceRead)
def update_khoury_resource(
    resource_id: int,
    payload: KhouryResourceUpdate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    resource = db.query(KhouryResource).filter(KhouryResource.id == resource_id).first()
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(resource, field, value)
    db.commit()
    db.refresh(resource)
    return resource


@router.delete("/{resource_id}", status_code=204)
def delete_khoury_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(verify_admin),
):
    resource = db.query(KhouryResource).filter(KhouryResource.id == resource_id).first()
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(resource)
    db.commit()
