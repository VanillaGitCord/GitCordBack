import jwt from "jsonwebtoken";

import User from "../model/User";

function isTokenExpired(token) {
  const now = Date.now().valueOf() / 1000;
  return !token || (token.exp < now);
}

function isTokenValid(token, targetUser) {
  return String(token.refreshAuth) === String(targetUser.refreshAuth);
}

module.exports.authToken = (req, res, next) => {
  const {
    body: { accessToken, refreshToken }
  } = req;

  if (!accessToken || !refreshToken) {
    return res.json({
      message: "No Token"
    });
  }

  try {
    const decodedAccessToken = jwt.decode(accessToken);
    const decodedRefreshToken = jwt.decode(refreshToken);

    if (isTokenExpired(decodedAccessToken)) {
      if (isTokenExpired(decodedRefreshToken)) {
        return res.json({ message: "Token expired" });
      }

      const refreshTargetUser = await User.findOne({ 
        email: decodedRefreshToken.email
      }).lean();

      if (isTokenValid(decodedRefreshToken, refreshTargetUser)) {
        return res.json({ warning: "Invalid Token" });
      }

      const newAccessToken = jwt.sign(
        {
          email: refreshTargetUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30m",
        }
      );

      return res.json({
        user: refreshTargetUser,
        accessToken: newAccessToken,
      });
    }

    const user = await User.findOne({ email: decodedAccessToken.email }).lean();

    res.json({
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ warning: "Internal server Error" });
  }
}
