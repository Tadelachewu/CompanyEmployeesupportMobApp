let nextId = 1;
const users = [];

async function getAll() {
  return users.slice();
}

async function getById(id) {
  return users.find(u => u.id === id) || null;
}

async function findByEmail(email) {
  return users.find(u => u.email === email) || null;
}

async function create({ name, email, password, role = 'user' }) {
  const user = { id: nextId++, name, email, password, role, createdAt: new Date().toISOString() };
  users.push(user);
  return user;
}

async function update(id, changes) {
  const u = await getById(id);
  if (!u) return null;
  Object.assign(u, changes);
  u.updatedAt = new Date().toISOString();
  return u;
}

async function remove(id) {
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return false;
  users.splice(idx, 1);
  return true;
}

// Seed some example users
(function seed() {
  if (users.length) return;
  const u1 = { id: nextId++, name: 'Alice Admin', email: 'admin@gmail.com', password: 'admin', role: 'admin', createdAt: new Date().toISOString() };
  const u2 = { id: nextId++, name: 'Bob User', email: 'user@gmail.com', password: 'user', role: 'user', createdAt: new Date().toISOString() };
  const u3 = { id: nextId++, name: 'Charlie Support', email: 'support@gmail.com', password: 'support', role: 'support', createdAt: new Date().toISOString() };
  users.push(u1, u2, u3);
})();

module.exports = { getAll, getById, findByEmail, create, update, remove };
