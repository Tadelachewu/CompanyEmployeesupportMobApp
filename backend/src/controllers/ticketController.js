const Tickets = require('../data/tickets');
const Users = require('../data/users');

exports.listTickets = async (req, res) => {
  let allTickets = await Tickets.getAll();
  if (req.user.role === 'support') {
    allTickets = allTickets.filter(t => t.assignedTo === req.user.id);
  } else if (req.user.role !== 'admin') {
    // Regular users see only their own created tickets
    allTickets = allTickets.filter(t => t.createdBy === req.user.id);
  }
  
  // Resolve creators and assignees
  const tickets = await Promise.all(allTickets.map(async t => {
    const user = await Users.getById(t.createdBy);
    const assignee = await Users.getById(t.assignedTo);
    return { 
      ...t, 
      creatorName: user ? user.name : 'Unknown User',
      assigneeName: assignee ? assignee.name : 'Unassigned'
    };
  }));
  res.json(tickets);
};

exports.getTicket = async (req, res) => {
  const id = Number(req.params.id);
  const ticket = await Tickets.getById(id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  
  if (req.user.role !== 'admin' && ticket.createdBy !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = await Users.getById(ticket.createdBy);
  res.json({ ...ticket, creatorName: user ? user.name : 'Unknown User' });
};

exports.createTicket = async (req, res) => {
  const { title, description, priority = 'normal', status = 'open' } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  // Enforce createdBy is the logged in user
  const createdBy = req.user.id;

  const newTicket = await Tickets.create({ title, description, priority, status, createdBy });
  res.status(201).json({ success: true, ticket: newTicket });
};

exports.updateTicket = async (req, res) => {
  const id = Number(req.params.id);
  const ticket = await Tickets.getById(id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  // If support, must be assigned
  if (req.user.role === 'support' && ticket.assignedTo !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden: You can only update tickets assigned to you' });
  }

  const updated = await Tickets.update(id, req.body);
  res.json(updated);
};

exports.deleteTicket = async (req, res) => {
  const id = Number(req.params.id);
  const ok = await Tickets.remove(id);
  if (!ok) return res.status(404).json({ error: 'Ticket not found' });
  res.status(204).end();
};

exports.assignTicket = async (req, res) => {
  const id = Number(req.params.id);
  const { assignedTo, status } = req.body;

  if (!assignedTo) {
    return res.status(400).json({ error: 'Assigned user ID is required' });
  }

  const updates = { assignedTo };
  if (status) {
    updates.status = status;
  } else {
    // Optionally change status to in_progress if assigning
    updates.status = 'in_progress';
  }

  const updated = await Tickets.update(id, updates);
  if (!updated) return res.status(404).json({ error: 'Ticket not found' });
  res.json(updated);
};
