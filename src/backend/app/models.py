from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Table, Text, Boolean
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
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False, default="", server_default="")
    off_campus = Column(JSON, nullable=False, default=dict, server_default="{}")

    courses = relationship("Course", secondary=topic_courses, back_populates="topics")
    clubs = relationship("Club", secondary=topic_clubs, back_populates="topics")
    professors = relationship("Professor", secondary=topic_professors, back_populates="topics")
    
    misc = Column(JSON, nullable=False, default=dict, server_default="{}")
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    
class Course(Base):
    __tablename__ = "courses"
    
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
    attributes = Column(JSON, default=list, server_default="[]")
    terms = Column(String(64), nullable=False, default="", server_default="")
    tutoring = Column(Text, nullable=False, default="", server_default="")
    category_tag = Column(JSON, default=list, server_default="[]")
    
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
    
    
    
    
    
    
    
    
    
    
    











