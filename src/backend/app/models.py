from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, JSON, String, Table, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

#---------------------------------------------------------
# Association Tables
#---------------------------------------------------------
topic_courses = Table(
    "topic_courses",
    Base.metadata,
    Column("topic_id", Integer, ForeignKey("topics.id"), primary_key=True),
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True),
)

topic_clubs = Table(
    "topic_clubs",
    Base.metadata,
    Column("topic_id", Integer, ForeignKey("topics.id"), primary_key=True),
    Column("club_id", Integer, ForeignKey("clubs.id"), primary_key=True),
)

topic_professors = Table(
    "topic_professors",
    Base.metadata,
    Column("topic_id", Integer, ForeignKey("topics.id"), primary_key=True),
    Column("professor_id", Integer, ForeignKey("professors.id"), primary_key=True),
)

topic_khoury_resources = Table(
    "topic_khoury_resources",
    Base.metadata,
    Column("topic_id", Integer, ForeignKey("topics.id"), primary_key=True),
    Column("khoury_resource_id", Integer, ForeignKey("khoury_resources.id"), primary_key=True),
)

course_prereqs = Table(
    "course_prereqs",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True),
    Column("prereq_id", Integer, ForeignKey("courses.id"), primary_key=True),
)

professor_courses = Table(
    "professor_courses",
    Base.metadata,
    Column("professor_id", Integer, ForeignKey("professors.id"), primary_key=True),
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True),
)

#---------------------------------------------------------
# Models
#---------------------------------------------------------
class Topic(Base):
    __tablename__ = "topics"
    __table_args__ = (
        Index("ix_topics_slug", "slug", unique=True),
        Index("ix_topics_title", "title", unique=True),
    )

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    # One of: build_and_secure | attack_and_defend | strategy_and_governance
    category = Column(String(32), nullable=False, index=True)
    # URL-friendly identifier, e.g. "network-security"
    slug = Column(String(128), nullable=False)
    # Display order within its category
    order = Column(Integer, nullable=False, default=0, server_default="0")
    description = Column(Text, nullable=False, default="", server_default="")
    off_campus = Column(JSON, nullable=False, default=dict, server_default="{}")

    courses = relationship("Course", secondary=topic_courses, back_populates="topics")
    clubs = relationship("Club", secondary=topic_clubs, back_populates="topics")
    professors = relationship("Professor", secondary=topic_professors, back_populates="topics")
    khoury_resources = relationship("KhouryResource", secondary=topic_khoury_resources)

    is_featured = Column(Boolean, nullable=False, default=False, server_default="false")

    # Optional rich content stored in misc:
    # misc.why_care, misc.secondary_section, misc.still_confused,
    # misc.active_research, misc.tools, misc.other_resources
    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())

class Course(Base):
    __tablename__ = "courses"
    __table_args__ = (Index("ix_courses_program_code", "course_program", "course_code", unique=True),)

    id = Column(Integer, primary_key=True, index=True)
    course_program = Column(String(6), nullable=False)
    course_code = Column(Integer, nullable=False)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False, default="", server_default="")
    extended_description = Column(Text, nullable=False, default="", server_default="")
    url = Column(Text, nullable=False, default="", server_default="")
    
    topics = relationship(
        "Topic", 
        secondary=topic_courses, 
        back_populates="courses"
    )
    past_professors = relationship(
        "Professor",
        secondary=professor_courses,
        back_populates="courses"
    )
    prereqs = relationship(
        "Course",
        secondary=course_prereqs,
        primaryjoin=lambda: Course.id == course_prereqs.c.course_id,
        secondaryjoin=lambda: Course.id == course_prereqs.c.prereq_id,
    )
    
    coreq = Column(Boolean, nullable=False, default=False, server_default="false")
    prereq_text = Column(Text, nullable=False, default="", server_default="")
    attributes = Column(JSON, default=list, server_default="[]")
    terms = Column(JSON, nullable=False, default=list, server_default="[]")
    tutoring = Column(Text, nullable=False, default="", server_default="")
    category_tag = Column(JSON, default=list, server_default="[]")
    class_type = Column(String(16), nullable=False, default="", server_default="")
    avg_section_count = Column(JSON, nullable=False, default=dict, server_default="{}")
    avg_class_size = Column(JSON, nullable=False, default=dict, server_default="{}")
    notes = Column(Text, nullable=False, default="", server_default="")
    is_featured = Column(Boolean, nullable=False, default=False, server_default="false")

    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())

class Professor(Base):
    __tablename__ = "professors"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(64), nullable=False)
    bio = Column(Text, nullable=False, default="", server_default="")
    area_of_focus = Column(String(255), nullable=False, default="", server_default="")
    photo = Column(Text, nullable=False, default="", server_default="")
    url = Column(Text, nullable=False, default="", server_default="")
    
    courses = relationship(
        "Course",
        secondary=professor_courses,
        back_populates="past_professors"
    )
    topics = relationship(
        "Topic", 
        secondary=topic_professors, 
        back_populates="professors"
    )
    
    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())

class DegreePlans(Base):
    __tablename__ = "degree_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    tags = Column(JSON, nullable=False, default=list, server_default="[]")
    url = Column(Text, nullable=False, default="", server_default="")
    
    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    
class Advising(Base):
    __tablename__ = "advising"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    tags = Column(JSON, nullable=False, default=list, server_default="[]")
    url = Column(Text, nullable=False, default="", server_default="")
    
    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    
class Coop(Base):
    __tablename__ = "coop"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    tags = Column(JSON, nullable=False, default=list, server_default="[]")
    url = Column(Text, nullable=False, default="", server_default="")
    
    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    
class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    tags = Column(JSON, nullable=False, default=list, server_default="[]")
    url = Column(Text, nullable=False, default="", server_default="")
    
    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    
class KhouryResource(Base):
    __tablename__ = "khoury_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=False, default="", server_default="")
    url = Column(Text, nullable=False, default="", server_default="")
    category = Column(String(64), nullable=False, index=True)
    priority = Column(String(16), nullable=False, default="EXPAND", server_default="EXPAND")
    is_featured = Column(Boolean, nullable=False, default=False, server_default="false")

    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())


class Club(Base):
    __tablename__ = "clubs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    location = Column(String(255), nullable=False)
    level = Column(JSON, nullable=False)
    
    mission = Column(Text, nullable=False, default="", server_default="")
    email = Column(String(128), nullable=False, default="", server_default="")
    tags = Column(JSON, nullable=False, default=list, server_default="[]")
    url = Column(Text, nullable=False, default="", server_default="")
    
    topics = relationship(
        "Topic",
        secondary=topic_clubs,
        back_populates="clubs"
    )

    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())


class AdminUser(Base):
    __tablename__ = "admin_users"
    __table_args__ = (
        Index("ix_admin_users_email", "email", unique=True),
        Index("ix_admin_users_token_hash", "token_hash", unique=True),
    )

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    email = Column(String(128), nullable=False)
    token_hash = Column(String(64), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True, server_default="true")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    
    
    
    
