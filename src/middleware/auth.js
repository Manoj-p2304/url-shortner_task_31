const isAuthenticated = (req, res, next) => {
  console.log('User in middleware:', req.user);
  if (req.isAuthenticated()) {
    return next(); // If user is authenticated, proceed to the next middleware/controller
  } else {
    return res.status(401).json({ error: 'User not authenticated' }); // Or redirect to login page
  }
};

export default isAuthenticated;
