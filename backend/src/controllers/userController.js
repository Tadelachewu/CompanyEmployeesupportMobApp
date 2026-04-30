const Users = require('../data/users');

exports.listUsers = async (req, res) => {
  const users = await Users.getAll();
  // Don't send passwords
  const safeUsers = users.map(u => {
    const { password, ...safe } = u;
    return safe;
  });
  res.json(safeUsers);
};

exports.createUser = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = await Users.findByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser = await Users.create({ name, email, password, role });
  const { password: _pw, ...userSafe } = newUser;
  res.status(201).json(userSafe);
};
