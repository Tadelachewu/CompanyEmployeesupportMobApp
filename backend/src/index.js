require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const ticketsRouter = require('./routes/tickets');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server for Socket.io and Express
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(bodyParser.json());

// Inject io into request object for use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/tickets', ticketsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => res.json({ status: 'ok', service: 'IT Support Ticket Backend' }));

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
