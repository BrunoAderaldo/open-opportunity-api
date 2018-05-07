const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: 'No token provided' });

  const parts = authHeader.split(' ');

  if (!parts.length === 2)
    return res.status(401).json({ error: 'Token error' });

  const [ schema, token ] = parts;

  if (!/^Bearer$/i.test(schema))
    return res.status(401).json({ error: 'Token bad format' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ error: 'Token invalid' });

    req.userId = decoded.id;

    return next();
  });
};