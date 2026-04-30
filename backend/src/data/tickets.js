const Users = require('./users');

let nextId = 1;
const tickets = [];

async function getAll() {
  return tickets.slice();
}

async function getById(id) {
  return tickets.find(t => t.id === id) || null;
}

async function create({ title, description = '', priority = 'normal', status = 'open', createdBy = null, assignedTo = null }) {
  const ticket = {
    id: nextId++,
    title,
    description,
    priority,
    status,
    createdBy,
    assignedTo,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };
  tickets.push(ticket);
  return ticket;
}

async function update(id, changes) {
  const t = await getById(id);
  if (!t) return null;
  Object.assign(t, changes);
  t.updatedAt = new Date().toISOString();
  return t;
}

async function remove(id) {
  const idx = tickets.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tickets.splice(idx, 1);
  return true;
}

// Seed example tickets
(async function seed() {
  const users = await Users.getAll();
  if (!users || !users.length) return;
  if (tickets.length) return;

  tickets.push({
    id: nextId++,
    title: 'Cannot access VPN',
    description: 'User cannot connect to corporate VPN from home.',
    priority: 'high',
    status: 'open',
    createdBy: users[1] ? users[1].id : users[0].id,
    assignedTo: users[0] ? users[0].id : null,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  });

  tickets.push({
    id: nextId++,
    title: 'Email not syncing',
    description: 'Mail app is not syncing new messages.',
    priority: 'normal',
    status: 'in_progress',
    createdBy: users[1] ? users[1].id : users[0].id,
    assignedTo: users[0] ? users[0].id : null,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  });
})();

module.exports = { getAll, getById, create, update, remove };
