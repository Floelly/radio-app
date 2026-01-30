from typing import Literal, List
from enum import Enum
from datetime import datetime, timezone
from email.utils import format_datetime, parsedate_to_datetime
from fastapi import FastAPI, HTTPException, Header, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, Field
from jwt import encode, decode, InvalidSignatureError
from pathlib import Path

app = FastAPI(title="Radio API", version="1.0.0")

# CORS-Konfiguration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuthRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class AuthenticatedUser(BaseModel):
    token: str

class RegisterResponse(BaseModel):
    success: bool

class WishRequest(BaseModel):
    artist: str
    song: str
    comment: str

class Wish(BaseModel):
    id: int
    timestamp: int
    email: EmailStr
    artist: str
    song: str
    text: str

class HostReviewRequest(BaseModel):
    rating: Literal["positive", "negative"]
    text: str = Field(min_length=1)

class HostReview(BaseModel):
    id: int
    timestamp: int
    email: EmailStr
    rating: Literal["positive", "negative"]
    text: str = Field(min_length=1)

class PlaylistFeedbackRequest(BaseModel):
    playlist: str
    rating: Literal["positive", "negative"]

class PlaylistVotes(BaseModel):
    positive: int
    negative: int

class CurrentTrack(BaseModel):
    id: str
    title: str
    artist: str
    album: str
    year: int
    duration: int
    coverUrl: str
    playlist: str

class CurrentHost(BaseModel):
    name: str
    email: EmailStr
    imageUrl: str

class CurrentPlaylist(BaseModel):
    playlist: str

class LiveFeedback(BaseModel):
    playlist: str
    ratings: PlaylistVotes
    reviews: List[HostReview]
    updatedAt: int

class Role(str, Enum):
    User = "User"
    Host = "Host"


USERS: dict[str, str] = {
    "host1@radio.com": "host123",
    "host2@radio.com": "host123",
    "user@someemail.com": "user123",
}

ROLES: dict[str, Role] = {
    "host1@radio.com": Role.Host,
    "host2@radio.com": Role.Host,
    "user@someemail.com": Role.User
}

SECRET = "somesecret"

TRACKS: List[CurrentTrack] = [
    CurrentTrack(
        id="track_001",
        title="Fake Track 1",
        artist="Fake Artist 1",
        album="Fake Album 1",
        year=2011,
        duration=244,
        coverUrl="/cover/red",
        playlist="90s" # TODO separate endpoint?
    ),
    CurrentTrack(
        id="track_002",
        title="Fake Track 2",
        artist="Fake Artist 2",
        album="Fake Album 2",
        year=2006,
        duration=185,
        coverUrl="/cover/gradient",
        playlist="Summer"
    ),
    CurrentTrack(
        id="track_003",
        title="Fake Track 3",
        artist="Fake Artist 3",
        album="Fake Album 3",
        year=2024,
        duration=219,
        coverUrl="/cover/green",
        playlist="Pop"
    )
]

HOST_REVIEWS: List[HostReview] = [
    HostReview(
        id=1,
        timestamp=1709251200,
        email="listener1@example.com",
        rating="positive",
        text="Guter Moderator.",
    ),
    HostReview(
        id=2,
        timestamp=1709254800,
        email="listener2@example.com",
        rating="negative",
        text="Zu viel Werbung!",
    ),
    HostReview(
        id=3,
        timestamp=1709258400,
        email="listener3@example.com",
        rating="positive",
        text="Der macht gute Witze.",
    ),
]

PLAYLIST_REVIEWS: dict[str, PlaylistVotes] = {
    "90s": PlaylistVotes(positive=33, negative=12),
    "Summer": PlaylistVotes(positive=56, negative=28),
    "Pop": PlaylistVotes(positive=49, negative=22),
}

PLAYLIST_RATINGS_UPDATED_AT: dict[str, int] = {
    playlist: 0 for playlist in PLAYLIST_REVIEWS.keys()
}

WISHES: List[Wish] = [
    Wish(
        id=1,
        timestamp=1709253000,
        email="listener2@example.com",
        song="",
        artist="",
        text="Ich wünsche mir \"Fake Track 3\", das ist mein Lieblingssong."
    ),
    Wish(
        id=2,
        timestamp=1709256600,
        email="listener2@example.com",
        song="Track 2",
        artist="keine ahnung",
        text="Mach mal Track 2 an!"
    )
]

def decode_token(token: str) -> dict:
    try:
        return decode(token, SECRET, algorithms=["HS256"])
    except InvalidSignatureError:
        raise HTTPException(status_code=401, detail="Token Signature Verification failed")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    return parts[1]


def next_host_review_id() -> int:
    return len(HOST_REVIEWS) + 1


def next_wish_id() -> int:
    return len(WISHES) + 1


@app.post("/login", response_model=AuthenticatedUser)
def login(payload: AuthRequest):
    stored_pw = USERS.get(payload.email)
    if stored_pw is None or stored_pw != payload.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = encode({"email": payload.email, "role": ROLES.get(payload.email)}, SECRET, algorithm="HS256")
    return AuthenticatedUser(token=token)


@app.post("/register", response_model=RegisterResponse)
def register(payload: AuthRequest):
    if payload.email in USERS:
        raise HTTPException(status_code=409, detail="Email already registered")

    USERS[payload.email] = payload.password
    ROLES[payload.email] = Role.User
    return RegisterResponse(success=True)


@app.get("/current-track", response_model=CurrentTrack)
def current_track(
    response: Response,
    if_modified_since: str | None = Header(default=None, alias="If-Modified-Since"),
):
    now_local = datetime.now().astimezone()
    minute_start_local = now_local.replace(second=0, microsecond=0)
    minute_start_utc = minute_start_local.astimezone(timezone.utc)
    response.headers["Last-Modified"] = format_datetime(minute_start_utc)

    if if_modified_since:
        try:
            ims_dt = parsedate_to_datetime(if_modified_since)
            if ims_dt is not None and ims_dt.tzinfo is None:
                ims_dt = ims_dt.replace(tzinfo=timezone.utc)
            if ims_dt and ims_dt >= minute_start_utc:
                return Response(status_code=304, headers=response.headers)
        except (TypeError, ValueError, IndexError):
            pass

    return TRACKS[now_local.minute % len(TRACKS)]


@app.get("/current-playlist", response_model=CurrentPlaylist)
def current_playlist(
    response: Response,
    if_modified_since: str | None = Header(default=None, alias="If-Modified-Since"),
):
    track = current_track(response, if_modified_since)
    if isinstance(track, Response):
        return track
    return CurrentPlaylist(playlist=track.playlist)


@app.get("/current-host", response_model=CurrentHost)
def current_host(
    response: Response,
    if_modified_since: str | None = Header(default=None, alias="If-Modified-Since"),
):
    response.headers["Last-Modified"] = format_datetime(datetime.now().astimezone())
    if if_modified_since:
        return Response(status_code=304, headers=response.headers)

    return CurrentHost(
        name="Peter",
        email="host1@radio.com",
        imageUrl="/cover/Peter",
    )


@app.get("/cover/{id}")
def cover(id: str):
    cover_image_path = Path("covers/" + id + ".png")
    if not cover_image_path.exists():
        raise HTTPException(status_code=404, detail="Cover image not found")
    return FileResponse(cover_image_path, media_type="image/png")


@app.post("/wish")
def wish(payload: WishRequest, authorization: str | None = Header(default=None)):
    token = extract_bearer_token(authorization)
    decoded = decode_token(token)
    WISHES.append(
        Wish(
            id=next_wish_id(),
            timestamp=int(datetime.now().timestamp()),
            email=decoded["email"],
            song=payload.song,
            artist=payload.artist,
            text=payload.comment
        )
    )
    return {"success": True}


@app.post("/feedback/host")
def feedback_host(payload: HostReviewRequest, authorization: str | None = Header(default=None)):
    token = extract_bearer_token(authorization)
    decoded = decode_token(token)

    HOST_REVIEWS.append(
        HostReview(
            id=next_host_review_id(),
            timestamp=int(datetime.now().timestamp()),
            email=decoded["email"],
            rating=payload.rating,
            text=payload.text,
        )
    )
    return {"success": True}


@app.post("/feedback/playlist")
def feedback_playlist(payload: PlaylistFeedbackRequest, authorization: str | None = Header(default=None)):
    token = extract_bearer_token(authorization)
    decoded = decode_token(token)
    playlist = payload.playlist
    counts = PLAYLIST_REVIEWS.get(playlist, PlaylistVotes(positive=0, negative=0))
    if payload.rating == "positive":
        PLAYLIST_REVIEWS[playlist] = PlaylistVotes(
            positive=counts.positive + 1,
            negative=counts.negative,
        )
    else:
        PLAYLIST_REVIEWS[playlist] = PlaylistVotes(
            positive=counts.positive,
            negative=counts.negative + 1,
        )
    PLAYLIST_RATINGS_UPDATED_AT[playlist] = int(datetime.now().timestamp())
    return {"success": True}


@app.get("/live/feedback", response_model=LiveFeedback)
def live_feedback(
    response: Response,
    since: int | None = None,
    authorization: str | None = Header(default=None),
):
    token = extract_bearer_token(authorization)
    decoded = decode_token(token)
    role = decoded["role"]
    if role != Role.Host:
        raise HTTPException(status_code=403, detail="Host role required")

    now_local = datetime.now().astimezone()
    minute_start_local = now_local.replace(second=0, microsecond=0)
    playlist_timestamp = int(minute_start_local.timestamp())
    current_track = TRACKS[now_local.minute % len(TRACKS)]
    current_playlist = current_track.playlist
    playlist_ratings = PLAYLIST_REVIEWS.get(
        current_playlist,
        PlaylistVotes(positive=0, negative=0),
    )
    playlist_ratings_timestamp = PLAYLIST_RATINGS_UPDATED_AT.get(
        current_playlist,
        0,
    )
    latest_review_timestamp = max(
        (item.timestamp for item in HOST_REVIEWS),
        default=0,
    )
    updated_at = max(
        playlist_timestamp,
        playlist_ratings_timestamp,
        latest_review_timestamp,
    )

    live_items: List[HostReview] = HOST_REVIEWS
    if since is not None:
        live_items = [item for item in live_items if item.timestamp > since]
    if since is not None and not live_items and since >= updated_at:
        return Response(status_code=304)
    live_items.sort(key=lambda item: item.timestamp, reverse=True)
    return LiveFeedback(
        playlist=current_playlist,
        ratings=playlist_ratings,
        reviews=live_items,
        updatedAt=updated_at,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True)
