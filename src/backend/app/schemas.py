from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, EmailStr, HttpUrl, field_validator

#---------------------------------------------------------
# Enums
#---------------------------------------------------------
class CourseProgram(StrEnum):
    CY = "CY"
    CS = "CS"
    DS = "DS"

class CourseAttribute(StrEnum):
    Ethical_Reasoning = "Ethical Reasoning"
    Writing_Intensive = "Writing Intensive"
    Formal_Quant_Reasoning = "Formal/Quant Reasoning"
    Natural_Designed_World = "Natural/Designed World"
    Analyzing_Using_Data = "Analyzing/Using Data"
    Creative_Expression_Innovation = "Creative Expression/Innovation"
    Interpreting_Culture = "Interpreting Culture"
    Capstone_Experience = "Capstone Experience"
    Societies_Institutions = "Societies/Institutions"

class CourseCategoryTag(StrEnum):
    SUPPORT = "Support"
    CS_REQ = "CS Requirement"
    CY_ELECT = "CY Elective"
    CY_REQ = "CY Requirement"

class Tags(StrEnum):
    UGRAD = "Undergraduate"
    GRAD = "Graduate"
    PHD = "PhD"

    FRESHMAN = "Freshman"
    SOPHOMORE = "Sophomore"
    JUNIOR = "Junior"
    SENIOR = "Senior"

    HONORS = "Honors"
    HONORS_LEGACY = "Honors Legacy"
    PLUSONE = "PlusOne"

    COMBINED_MAJOR = "Combined Major"
    DUAL_MAJOR = "Dual Major"
    MINOR = "Minor"

#---------------------------------------------------------
# Shared
#---------------------------------------------------------
class OffCampus(BaseModel):
    certifications: dict[str, HttpUrl] = {}
    learning_tools: dict[str, HttpUrl] = {}
    socials: dict[str, HttpUrl] = {}

#---------------------------------------------------------
# Topic Schemas
#---------------------------------------------------------
class TopicCreate(BaseModel):
    title: str
    description: str = ""
    off_campus: OffCampus = OffCampus()
    misc: dict = {}

class TopicRead(BaseModel):
    id: int
    title: str
    description: str
    off_campus: OffCampus
    course_ids: list[int] = []
    club_ids: list[int] = []
    professor_ids: list[int] = []
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class TopicUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    off_campus: OffCampus | None = None
    misc: dict | None = None

#---------------------------------------------------------
# Course Schemas
#---------------------------------------------------------
class CourseCreate(BaseModel):
    course_program: CourseProgram
    course_code: int
    title: str
    description: str = ""
    extended_description: str = ""
    url: str = ""
    coreq: bool = False
    attributes: list[CourseAttribute] = []
    terms: str = ""
    tutoring: str = ""
    category_tag: list[CourseCategoryTag] = []
    misc: dict = {}

    @field_validator("course_code")
    @classmethod
    def validate_course_code(cls, v):
        if v < 0 or v > 9999:
            raise ValueError("Course code must be a valid number")
        return v

class CourseRead(BaseModel):
    id: int
    course_program: str
    course_code: int
    title: str
    description: str
    extended_description: str
    url: str
    coreq: bool
    attributes: list[str]
    terms: str
    tutoring: str
    category_tag: list[str]
    topic_ids: list[int] = []
    prereq_ids: list[int] = []
    past_professor_ids: list[int] = []
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class CourseUpdate(BaseModel):
    course_program: CourseProgram | None = None
    course_code: int | None = None
    title: str | None = None
    description: str | None = None
    extended_description: str | None = None
    url: str | None = None
    coreq: bool | None = None
    attributes: list[CourseAttribute] | None = None
    terms: str | None = None
    tutoring: str | None = None
    category_tag: list[CourseCategoryTag] | None = None
    misc: dict | None = None

    @field_validator("course_code")
    @classmethod
    def validate_course_code(cls, v):
        if v is not None and (v < 0 or v > 9999):
            raise ValueError("Course code must be a valid number")
        return v

#---------------------------------------------------------
# Professor Schemas
#---------------------------------------------------------
class ProfessorCreate(BaseModel):
    full_name: str
    bio: str = ""
    area_of_focus: str = ""
    photo: str = ""
    url: str = ""
    misc: dict = {}

class ProfessorRead(BaseModel):
    id: int
    full_name: str
    bio: str
    area_of_focus: str
    photo: str
    url: str
    course_ids: list[int] = []
    topic_ids: list[int] = []
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class ProfessorUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    area_of_focus: str | None = None
    photo: str | None = None
    url: str | None = None
    misc: dict | None = None

#---------------------------------------------------------
# Degree Plan Schemas
#---------------------------------------------------------
class DegreePlanCreate(BaseModel):
    title: str
    tags: list[Tags] = []
    url: str = ""
    misc: dict = {}

class DegreePlanRead(BaseModel):
    id: int
    title: str
    tags: list[str]
    url: str
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class DegreePlanUpdate(BaseModel):
    title: str | None = None
    tags: list[Tags] | None = None
    url: str | None = None
    misc: dict | None = None

#---------------------------------------------------------
# Advising Schemas
#---------------------------------------------------------
class AdvisingCreate(BaseModel):
    title: str
    tags: list[Tags] = []
    url: str = ""
    misc: dict = {}

class AdvisingRead(BaseModel):
    id: int
    title: str
    tags: list[str]
    url: str
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class AdvisingUpdate(BaseModel):
    title: str | None = None
    tags: list[Tags] | None = None
    url: str | None = None
    misc: dict | None = None

#---------------------------------------------------------
# Coop Schemas
#---------------------------------------------------------
class CoopCreate(BaseModel):
    title: str
    tags: list[Tags] = []
    url: str = ""
    misc: dict = {}

class CoopRead(BaseModel):
    id: int
    title: str
    tags: list[str]
    url: str
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class CoopUpdate(BaseModel):
    title: str | None = None
    tags: list[Tags] | None = None
    url: str | None = None
    misc: dict | None = None

#---------------------------------------------------------
# Resume Schemas
#---------------------------------------------------------
class ResumeCreate(BaseModel):
    title: str
    tags: list[Tags] = []
    url: str = ""
    misc: dict = {}

class ResumeRead(BaseModel):
    id: int
    title: str
    tags: list[str]
    url: str
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class ResumeUpdate(BaseModel):
    title: str | None = None
    tags: list[Tags] | None = None
    url: str | None = None
    misc: dict | None = None

#---------------------------------------------------------
# Club Schemas
#---------------------------------------------------------
class ClubCreate(BaseModel):
    name: str
    location: str
    level: list[str]
    mission: str = ""
    email: str = ""
    tags: list[Tags] = []
    url: str = ""
    misc: dict = {}

class ClubRead(BaseModel):
    id: int
    name: str
    location: str
    level: list[str]
    mission: str
    email: str
    tags: list[str]
    url: str
    topic_ids: list[int] = []
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class ClubUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    level: list[str] | None = None
    mission: str | None = None
    email: str | None = None
    tags: list[Tags] | None = None
    url: str | None = None
    misc: dict | None = None
