from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, EmailStr, HttpUrl, field_validator


#---------------------------------------------------------
# Courses
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
    
class CourseCreate(BaseModel):
    course_program: CourseProgram
    course_code: int

    @field_validator("course_code")
    @classmethod
    def validate_course_code(cls, v):
        if v < 0 or v > 9999:
            raise ValueError("Course code must be a 4-digit number")
        return v

#---------------------------------------------------------
# Tags
#---------------------------------------------------------
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
# Topics
#---------------------------------------------------------
class OffCampus(BaseModel):
    certifications: dict[str, HttpUrl]
    learning_tools: dict[str, HttpUrl]
    socials: dict[str, HttpUrl]


# # ── User ──────────────────────────────────────────────

# class UserCreate(BaseModel):
#     email: EmailStr
#     username: str
#     password: str


# class UserRead(BaseModel):
#     id: int
#     email: str
#     username: str
#     created_at: datetime

#     model_config = {"from_attributes": True}


# # ── Resource ──────────────────────────────────────────

# class ResourceCreate(BaseModel):
#     title: str
#     description: str | None = None
#     url: str | None = None
#     category: str | None = None


# class ResourceRead(BaseModel):
#     id: int
#     title: str
#     description: str | None
#     url: str | None
#     category: str | None
#     author_id: int | None
#     created_at: datetime

#     model_config = {"from_attributes": True}
