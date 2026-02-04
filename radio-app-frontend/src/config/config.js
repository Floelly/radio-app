export const TEXTAREA_ROWS_DEFAULT = 3;
export const QUEUE_NEXT_SLICE_SIZE = 3;
export const TOAST_AUTO_HIDE_MS = 3000;
export const LOGIN_REQUIRED_TOAST_MESSAGE = "Bitte zuerst einloggen.";
export const HOST_FEEDBACK_POLL_INTERVAL_MS = 5000;
export const QUEUE_REFRESH_INTERVAL_MS = 10_000;
export const TRACK_REFRESH_INTERVAL_MS = 10_000;
export const PLAYLIST_REFRESH_INTERVAL_MS = 30_000;
export const HOST_REFRESH_INTERVAL_MS = 30_000;
const ENV =
  (typeof import.meta !== "undefined" && import.meta.env) ||
  (typeof process !== "undefined" && process.env) ||
  {};
export const BACKEND_BASE_URL =
  ENV.VITE_BACKEND_BASE_URL || "http://localhost:8080";
export const FRONTEND_BASE_URL =
  ENV.VITE_FRONTEND_BASE_URL || "http://localhost:5173";

const UI_COMMON = {
  genericError: "An Error occured!",
  unknown: "Unbekannt",
  thumbsUp: "👍",
  thumbsDown: "👎",
  feedbackSendError: "Fehler beim Senden deines Feedbacks.",
};

export const UI_TEXT = {
  common: UI_COMMON,
  app: {
    title: "Radio App",
    nav: {
      home: "Home",
      playlist: "Playlist",
      feedback: "Feedback",
      songWish: "Liedwunsch",
      user: "User",
      login: "Login",
    },
  },
  home: {
    loadingTrack: "Lade aktuellen Titel...",
    loadTrackError: "Aktueller Titel konnte nicht geladen werden.",
    noTrack: "Kein aktueller Titel verfügbar.",
    noCover: "Kein Cover",
    liveRadio: "Live im Radio",
    liveBadge: "Live",
    hostSubtitle: "Begleitet dich durch die aktuelle Sendung",
    hostNameFallback: "uns",
    hostMessagePrompt: (name) => `Willst du ${name} eine Nachricht schreiben?`,
    hostMessageButton: (name) => `Hallo ${name} ...`,
    loginForHostMessageButton: "Zum Login, für Feedback",
    playlistCommentPrefix: "· Playlist: ",
    artistAlbumSeparator: " · ",
    formatYear: (year) => ` (${year})`,
    trackCoverAlt: (title) => `${title} Cover`,
    hostPortraitAlt: (name) => `${name} Portrait`,
  },
  rateModerator: {
    ratingRequired: "Daumen hoch oder Daumen runter?",
    commentRequired: "Huch? sieht aus als hättest du noch nichts geschrieben.",
    submitSuccess: "Danke für deine Nachricht!",
    submitError: UI_COMMON.feedbackSendError,
    prompt: (name) => `Wie gefällt dir unser Moderator ${name}?`,
    promptFollowup: "Schreib ihm doch ne Nachricht.",
    textareaPlaceholder: "Bewertung...",
    submitButton: "Bewerten",
  },
  login: {
    instruction: "Bitte anmelden oder registrieren um fortzufahren.",
    emailPlaceholder: "E-Mail",
    passwordPlaceholder: "Passwort",
    registerButton: "Registrieren",
    loginButton: "Einloggen",
  },
  host: {
    loading: "Lade Live-Updates...",
    loadError: "Live-Updates konnten nicht geladen werden.",
    currentPlaylistLabel: "Aktuelle Playlist",
    noReviews: "Noch keine Reviews.",
    ratingPositive: "Positiv",
    ratingNegative: "Negativ",
    ratingPlaceholderPositive: `${UI_COMMON.thumbsUp} -`,
    ratingPlaceholderNegative: `${UI_COMMON.thumbsDown} -`,
    userFeedbackHeadline: "Neustes Hörer Feedback",
  },
  playlist: {
    loadError: "Fehler beim Laden der Playlist.",
    queueLoadError: "Fehler beim Laden der Warteschlange.",
    feedbackSuccess: (liked) =>
      `Danke für dein Feedback! ${
        liked ? UI_COMMON.thumbsUp : UI_COMMON.thumbsDown
      }`,
    feedbackError: UI_COMMON.feedbackSendError,
    currentPlaylistTitle: "Die aktuelle Playlist",
    loadingName: "Playlist wird geladen...",
    loadingInfoText: "Infos zur Playlist werden gerade geladen.",
    nowPlayingLabel: "Jetzt zu Hören",
    nextHitsLabel: "Die nächsten Hits",
    feedbackPrompt: "Gefällt dir unsere Playlist?",
    loginForPlaylistFeedbackButton: "Zum Login, um zu bewerten",
  },
  wish: {
    emptyFieldsError: "Bitte mindestens ein Feld ausfüllen.",
    success: "Wunsch wurde gesendet!",
    error: "An Error occured while sending request!",
    intro:
      "Wünsche dir jetzt einen Song und mache unsere Playlist zu deiner Playlist!",
    songPlaceholder: "Lied",
    artistPlaceholder: "Interpret",
    commentPlaceholder: "Zusatzinfo ...",
    submitButton: "Wunsch abschicken",
  },
  user: {
    loggedInAs: "Angemeldet als",
    logoutButton: "Logout",
  },
};
