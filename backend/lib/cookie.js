export const JWT_COOKIE_NAME = "jwt";

export const jwtCookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
  path: "/",
};
