module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
    }
};
