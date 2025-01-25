

 const dashboard = (req, res) => {
  // If user is authenticated, display dashboard with user info
  if (req.isAuthenticated() && req.user) {
    return res.status(200).json({
      message: 'Successfully logged in!',
      user: req.user,
    });
  } else {
    return res.status(401).json({ message: 'Please log in first' });
  }
};

export default dashboard;