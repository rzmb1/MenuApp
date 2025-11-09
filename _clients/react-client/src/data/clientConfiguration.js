const MENUS = ["Menü A", "Menü B", "Menü C"];
const MENU_COLORS = {
  "Menü A": "bg-blue-600",
  "Menü B": "bg-red-600",
  "Menü C": "bg-green-600",
  "Hover Menü A": "bg-blue-700",
  "Hover Menü B": "bg-red-700",
  "Hover Menü C": "bg-green-700",
};
const MENU_COLORS_PLAIN = {
  "Menü A": "#2563EB",
  "Menü B": "#DC2626",
  "Menü C": "#059669",
}
const MONTHS = [
  "Jänner",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
const MENUPLAN_URL = "/api/menuplans";
const DEFAULT_USERS_URL = "/api/users";
const USERS_URL = `${DEFAULT_USERS_URL}/byAuthenticationHeader`;
const STATISTICS_URL = "/api/menuplans/statistics";
const POLL_URL = "/api/polls";
const VOTES_URL = "/api/votes";
const NOTIFICATIONS_URL = "/api/notifications";
const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
const MOBILE_DAYS = {
  Montag: "MO",
  Dienstag: "DI",
  Mittwoch: "MI",
  Donnerstag: "DO",
  Freitag: "FR",
};
const CALENDAR_DAYS = [...DAYS.map((day) => MOBILE_DAYS[day]), "SA", "SO"];
const SIGNUP_URL = "/api/signups";
const COURSES = ["Vorspeise", "Hauptspeise", "Nachspeise"];
const POLL_CATEGORIES = ["vorspeisen", "hauptspeisen", "nachspeisen"];
const NULLDISH = { name: "Abgemeldet", tags: [] };
const SCREEN_SIZE_CONDITIONER = window.innerWidth > 1199;
const LOGIN_REQUEST = {
  scopes: [],
};
const MSAL_CONFIGURATION = {
  auth: {
    clientId: "48103e66-de99-48b5-9b96-6b97aa2aeaca", // clientId
    authority: "https://login.microsoftonline.com/2b197efa-8e1b-4680-b263-8e237889b5b3", // tenantId
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};
const CLIENT_CONFIGURATION = {
  MENUS: MENUS,
  MENU_COLORS: MENU_COLORS,
  MENUPLAN_URL: MENUPLAN_URL,
  SIGNUP_URL: SIGNUP_URL,
  STATISTICS_URL: STATISTICS_URL,
  MONTHS: MONTHS,
  USERS_URL: USERS_URL,
  DAYS: DAYS,
  MOBILE_DAYS: MOBILE_DAYS,
  CALENDAR_DAYS: CALENDAR_DAYS,
  COURSES: COURSES,
  NULLDISH: NULLDISH,
  SCREEN_SIZE_CONDITIONER: SCREEN_SIZE_CONDITIONER,
  MSAL_CONFIGURATION: MSAL_CONFIGURATION,
  LOGIN_REQUEST: LOGIN_REQUEST
};

export {
  MENUS,
  MENU_COLORS,
  MENU_COLORS_PLAIN,
  MENUPLAN_URL,
  POLL_URL,
  VOTES_URL,
  NOTIFICATIONS_URL,
  DEFAULT_USERS_URL,
  MONTHS,
  USERS_URL,
  DAYS,
  MOBILE_DAYS,
  CALENDAR_DAYS,
  SIGNUP_URL,
  COURSES,
  POLL_CATEGORIES,
  NULLDISH,
  STATISTICS_URL,
  SCREEN_SIZE_CONDITIONER,
  LOGIN_REQUEST,
  MSAL_CONFIGURATION
};
export default CLIENT_CONFIGURATION;





