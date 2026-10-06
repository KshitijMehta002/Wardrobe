
const admin = async (req, res, next) => {
    let token;
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied, admin only' });
    }
}

module.exports = { admin };
