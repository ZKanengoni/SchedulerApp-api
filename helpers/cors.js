cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,PUT,PATCH,POST,DELETE,OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,Content-type,X-Access-Token,Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
};

module.exports = cors;
