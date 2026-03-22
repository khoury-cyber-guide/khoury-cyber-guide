import re
from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, HttpUrl, field_validator

_SLUG_RE = re.compile(r"^[a-z0-9-]{1,128}$")

#---------------------------------------------------------
# Enums
#---------------------------------------------------------
class TopicCategory(StrEnum):
    BUILD_AND_SECURE = "build_and_secure"
    ATTACK_AND_DEFEND = "attack_and_defend"
    STRATEGY_AND_GOVERNANCE = "strategy_and_governance"

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
# Summary Schemas
#---------------------------------------------------------
class TopicSummary(BaseModel):
    id: int
    title: str
    slug: str
    category: str
    order: int
    description: str

    model_config = {"from_attributes": True}

class CourseSummary(BaseModel):
    id: int
    course_program: str
    course_code: int
    title: str
    description: str
    category_tag: list[str]

    model_config = {"from_attributes": True}

class ProfessorSummary(BaseModel):
    id: int
    full_name: str
    area_of_focus: str
    photo: str
    url: str

    model_config = {"from_attributes": True}

class ClubSummary(BaseModel):
    id: int
    name: str
    mission: str
    url: str
    tags: list[str]

    model_config = {"from_attributes": True}

#---------------------------------------------------------
# Topic Schemas
#---------------------------------------------------------
class TopicCreate(BaseModel):
    title: str
    category: TopicCategory
    slug: str
    order: int = 0
    description: str = ""
    off_campus: OffCampus = OffCampus()
    misc: dict = {}

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: str) -> str:
        if not _SLUG_RE.match(v):
            raise ValueError("slug must be 1-128 lowercase alphanumeric characters or hyphens")
        return v

class TopicRead(BaseModel):
    id: int
    title: str
    category: str
    slug: str
    order: int
    description: str
    off_campus: OffCampus
    courses: list[CourseSummary] = []
    clubs: list[ClubSummary] = []
    professors: list[ProfessorSummary] = []
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class TopicUpdate(BaseModel):
    title: str | None = None
    category: TopicCategory | None = None
    slug: str | None = None
    order: int | None = None
    description: str | None = None
    off_campus: OffCampus | None = None
    misc: dict | None = None

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: str | None) -> str | None:
        if v is not None and not _SLUG_RE.match(v):
            raise ValueError("slug must be 1-128 lowercase alphanumeric characters or hyphens")
        return v

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
    topics: list[TopicSummary] = []
    prereqs: list[CourseSummary] = []
    past_professors: list[ProfessorSummary] = []
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
