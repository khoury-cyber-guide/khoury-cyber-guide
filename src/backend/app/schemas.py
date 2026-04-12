import re
from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, field_validator

_SLUG_RE = re.compile(r"^[a-z0-9-]{1,128}$")

#---------------------------------------------------------
# Enums
#---------------------------------------------------------
class TopicCategory(StrEnum):
    BUILD_AND_SECURE = "build_and_secure"
    ATTACK_AND_DEFEND = "attack_and_defend"
    STRATEGY_AND_GOVERNANCE = "strategy_and_governance"

class CourseProgram(StrEnum):
    ACCT = "ACCT"
    ACC = "ACC"
    AVM = "AVM"
    AFRS = "AFRS"
    AFCS = "AFCS"
    AMSL = "AMSL"
    ALY = "ALY"
    ANTH = "ANTH"
    ANT = "ANT"
    AAI = "AAI"
    APL = "APL"
    ARAB = "ARAB"
    ARCH = "ARCH"
    ARMY = "ARMY"
    ART = "ART"
    ARTG = "ARTG"
    ARTF = "ARTF"
    ARTE = "ARTE"
    ARTH = "ARTH"
    ARTD = "ARTD"
    ARTS = "ARTS"
    ASNS = "ASNS"
    AACE = "AACE"
    BNSC = "BNSC"
    BIOC = "BIOC"
    BIOE = "BIOE"
    BINF = "BINF"
    BIOL = "BIOL"
    BIO = "BIO"
    BIOT = "BIOT"
    BTC = "BTC"
    BUSN = "BUSN"
    EXSC = "EXSC"
    CHME = "CHME"
    CHEM = "CHEM"
    CHM = "CHM"
    CHNS = "CHNS"
    CIVE = "CIVE"
    CED = "CED"
    COMM = "COMM"
    CMN = "CMN"
    CMMN = "CMMN"
    CNET = "CNET"
    CET = "CET"
    CS = "CS"
    CSYE = "CSYE"
    CMG = "CMG"
    EEAM = "EEAM"
    EEBA = "EEBA"
    EESC = "EESC"
    EESH = "EESH"
    EXED = "EXED"
    COOP = "COOP"
    COP = "COP"
    INNO = "INNO"
    CAEP = "CAEP"
    CRTE = "CRTE"
    CRWT = "CRWT"
    CRIM = "CRIM"
    CJS = "CJS"
    CLTR = "CLTR"
    CY = "CY"
    DADS = "DADS"
    DA = "DA"
    DAMG = "DAMG"
    DS = "DS"
    DEAF = "DEAF"
    DGM = "DGM"
    DGTR = "DGTR"
    ENVR = "ENVR"
    EEMB = "EEMB"
    ECON = "ECON"
    ECN = "ECN"
    ECNM = "ECNM"
    EDUC = "EDUC"
    EDU = "EDU"
    EECE = "EECE"
    EET = "EET"
    ENSY = "ENSY"
    ENCP = "ENCP"
    ENGR = "ENGR"
    ENLR = "ENLR"
    EMGT = "EMGT"
    ENGL = "ENGL"
    ENG = "ENG"
    ESLG = "ESLG"
    ENGW = "ENGW"
    EAI = "EAI"
    ENTR = "ENTR"
    ESC = "ESC"
    ENVS = "ENVS"
    EXRE = "EXRE"
    FINA = "FINA"
    FIN = "FIN"
    FSEM = "FSEM"
    FRNH = "FRNH"
    GAME = "GAME"
    GSND = "GSND"
    GE = "GE"
    GET = "GET"
    GIS = "GIS"
    GRMN = "GRMN"
    GBST = "GBST"
    GST = "GST"
    HINF = "HINF"
    HMG = "HMG"
    HSCI = "HSCI"
    HSC = "HSC"
    HLTH = "HLTH"
    HBRW = "HBRW"
    HIST = "HIST"
    HST = "HST"
    HSTY = "HSTY"
    HLS = "HLS"
    HONR = "HONR"
    HRMG = "HRMG"
    HRM = "HRM"
    HUSV = "HUSV"
    HSV = "HSV"
    IE = "IE"
    IS = "IS"
    INFO = "INFO"
    ITC = "ITC"
    INS = "INS"
    INT = "INT"
    INAM = "INAM"
    INMI = "INMI"
    INPR = "INPR"
    INSC = "INSC"
    INSH = "INSH"
    INTL = "INTL"
    INTB = "INTB"
    INTP = "INTP"
    ITLN = "ITLN"
    JPNS = "JPNS"
    JWSS = "JWSS"
    JRNL = "JRNL"
    KORE = "KORE"
    LARC = "LARC"
    LANG = "LANG"
    LACS = "LACS"
    LWP = "LWP"
    LPSC = "LPSC"
    LW = "LW"
    LAW = "LAW"
    LDR = "LDR"
    LS = "LS"
    LST = "LST"
    LING = "LING"
    MGMT = "MGMT"
    MGT = "MGT"
    MISM = "MISM"
    MGSC = "MGSC"
    MECN = "MECN"
    MKTG = "MKTG"
    MKT = "MKT"
    MATL = "MATL"
    MATH = "MATH"
    MTH = "MTH"
    MATM = "MATM"
    MEIE = "MEIE"
    ME = "ME"
    MET = "MET"
    MSCR = "MSCR"
    MSCI = "MSCI"
    MUSC = "MUSC"
    MUS = "MUS"
    MUSI = "MUSI"
    MUST = "MUST"
    NNMD = "NNMD"
    NETS = "NETS"
    NPM = "NPM"
    NRSG = "NRSG"
    NTR = "NTR"
    OR = "OR"
    ORGB = "ORGB"
    PHSC = "PHSC"
    PMST = "PMST"
    PMCL = "PMCL"
    PHMD = "PHMD"
    PHDL = "PHDL"
    PHIL = "PHIL"
    PHL = "PHL"
    PHLS = "PHLS"
    PT = "PT"
    PTH = "PTH"
    PA = "PA"
    PHYS = "PHYS"
    PHY = "PHY"
    POLS = "POLS"
    POL = "POL"
    PLSC = "PLSC"
    PORT = "PORT"
    PDM = "PDM"
    PST = "PST"
    PJM = "PJM"
    PSYC = "PSYC"
    PSY = "PSY"
    PHTH = "PHTH"
    PPUA = "PPUA"
    PREL = "PREL"
    PBR = "PBR"
    RGA = "RGA"
    RFA = "RFA"
    RMS = "RMS"
    RPT = "RPT"
    RSSN = "RSSN"
    SMT = "SMT"
    SMFA = "SMFA"
    SOCL = "SOCL"
    SOC = "SOC"
    SCLY = "SCLY"
    SPNS = "SPNS"
    SLPA = "SLPA"
    SIA = "SIA"
    STRT = "STRT"
    ABRD = "ABRD"
    ABRB = "ABRB"
    ABRC = "ABRC"
    ABRL = "ABRL"
    ABRS = "ABRS"
    ABRH = "ABRH"
    ABRU = "ABRU"
    SCHM = "SCHM"
    SBSY = "SBSY"
    SUEN = "SUEN"
    TCC = "TCC"
    TELR = "TELR"
    TELE = "TELE"
    THTR = "THTR"
    WMNS = "WMNS"

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
    SOCIAL_ISSUES = "Social Issues Requirement"
    PRESENTATION = "Presentation Requirement"
    MISC_ELECT = "Misc. Elective"

class ClassType(StrEnum):
    ONLINE = "ONLINE"
    IN_PERSON = "IN-PERSON"
    BOTH = "BOTH"

class KhouryResourceCategory(StrEnum):
    GENERAL_UNIVERSITY = "general_university"
    ADVISING_DEGREE_PLANNING = "advising_degree_planning"
    COOP_CAREER_PLANNING = "coop_career_planning"
    CLUBS_ON_CAMPUS_EVENTS = "clubs_on_campus_events"
    SCHOLARSHIP_FINANCIAL_AID = "scholarship_financial_aid"
    UNDERGRADUATE_RESEARCH = "undergraduate_research"
    WELLBEING_MENTAL_HEALTH = "wellbeing_mental_health"

class KhouryResourcePriority(StrEnum):
    TOP_3 = "TOP_3"
    EXPAND = "EXPAND"
    IF_SPACE = "IF_SPACE"

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
class ResourceItem(BaseModel):
    name: str
    url: str
    description: str = ""

class ToolItem(BaseModel):
    name: str
    download_url: str | None = None
    support_url: str | None = None
    description: str = ""

class OffCampus(BaseModel):
    certifications: list[ResourceItem] = []
    learning_tools: list[ResourceItem] = []
    blogs_newsletters: list[ResourceItem] = []
    tools: list[ToolItem] = []
    other_resources: list[ResourceItem] = []

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
    is_featured: bool

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

class KhouryResourceSummary(BaseModel):
    id: int
    name: str
    description: str
    url: str
    category: str
    priority: str
    is_featured: bool

    model_config = {"from_attributes": True}

#---------------------------------------------------------
# Admin
#---------------------------------------------------------
class AdminVerifyResponse(BaseModel):
    name: str
    email: str

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
    course_ids: list[int] = []
    club_ids: list[int] = []
    khoury_resource_ids: list[int] = []
    professor_ids: list[int] = []

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
    khoury_resources: list[KhouryResourceSummary] = []
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
    course_ids: list[int] | None = None
    club_ids: list[int] | None = None
    khoury_resource_ids: list[int] | None = None
    professor_ids: list[int] | None = None

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
    prereq_text: str = ""
    attributes: list[CourseAttribute] = []
    terms: list[str] = []
    tutoring: str = ""
    category_tag: list[CourseCategoryTag] = []
    class_type: ClassType | None = None
    avg_section_count: dict = {}
    avg_class_size: dict = {}
    notes: str = ""
    is_featured: bool = False
    misc: dict = {}
    prereq_ids: list[int] = []
    professor_ids: list[int] = []

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
    prereq_text: str
    attributes: list[str]
    terms: list[str]
    tutoring: str
    category_tag: list[str]
    class_type: str
    avg_section_count: dict
    avg_class_size: dict
    notes: str
    is_featured: bool
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
    prereq_text: str | None = None
    attributes: list[CourseAttribute] | None = None
    terms: list[str] | None = None
    tutoring: str | None = None
    category_tag: list[CourseCategoryTag] | None = None
    class_type: str | None = None
    avg_section_count: dict | None = None
    avg_class_size: dict | None = None
    notes: str | None = None
    is_featured: bool | None = None
    misc: dict | None = None
    prereq_ids: list[int] | None = None
    professor_ids: list[int] | None = None

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
    course_ids: list[int] = []
    topic_ids: list[int] = []

class ProfessorRead(BaseModel):
    id: int
    full_name: str
    bio: str
    area_of_focus: str
    photo: str
    url: str
    courses: list[CourseSummary] = []
    topics: list[TopicSummary] = []
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
    course_ids: list[int] | None = None
    topic_ids: list[int] | None = None

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
    topic_ids: list[int] = []

class ClubRead(BaseModel):
    id: int
    name: str
    location: str
    level: list[str]
    mission: str
    email: str
    tags: list[str]
    url: str
    topics: list[TopicSummary] = []
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
    topic_ids: list[int] | None = None

#---------------------------------------------------------
# KhouryResource Schemas
#---------------------------------------------------------
class KhouryResourceCreate(BaseModel):
    name: str
    description: str = ""
    url: str = ""
    category: KhouryResourceCategory
    priority: KhouryResourcePriority = KhouryResourcePriority.EXPAND
    is_featured: bool = False
    misc: dict = {}

class KhouryResourceRead(BaseModel):
    id: int
    name: str
    description: str
    url: str
    category: str
    priority: str
    is_featured: bool
    misc: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class KhouryResourceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    url: str | None = None
    category: KhouryResourceCategory | None = None
    priority: KhouryResourcePriority | None = None
    is_featured: bool | None = None
    misc: dict | None = None
