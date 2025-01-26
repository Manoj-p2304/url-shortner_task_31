export const dashboard = (req, res) => {
    if (req.isAuthenticated()) {
      return res.status(200).json({
        message: 'Successfully logged in!',
        user: ` ${req.user.name}`,
      });
    } else {
        return res.redirect('/auth/google'); // Redirect to login if not authenticated
    }
};
