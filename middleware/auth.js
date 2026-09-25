function isLoggedIn(req, res, next) {
  if (req.session && req.session.customer) {
    return next();
  }
  return res.redirect("/auth/login");
}

function isAdmin(req, res, next) {
  if (req.session?.customer?.role === "admin") {
    return next();
  }
  return res.status(403).send("Access Denied: Admin role required.");
}

module.exports = { isLoggedIn, isAdmin };
