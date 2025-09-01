const Ticket = require('../models/ticketModel');
const Locataire = require('../models/locataireModel');
const Artisan = require('../models/artisanModel');

const ticketController = {
  createTicket: async (req, res) => {
    try {
      const { locataireId, type_incident, description } = req.body;
      if (!locataireId || !type_incident || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const ticket = await Ticket.create({ locataireId, type_incident, description });
      res.status(201).json(ticket);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllTickets: async (req, res) => {
    try {
      const tickets = await Ticket.findAll();
      res.json(tickets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Missing status field' });
      }
      const updatedTicket = await Ticket.updateStatus(ticketId, status);
      if (!updatedTicket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.json(updatedTicket);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  assignArtisan: async (req, res) => {
    try {
      const { ticketId } = req.params;
      if (!ticketId) {
        return res.status(400).json({ error: 'Missing ticketId parameter' });
      }
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      const artisan = await Artisan.findBySpecialty(ticket.type_incident);
      if (!artisan) {
        return res.status(404).json({ error: 'No artisan found for this specialty' });
      }
      const updatedTicket = await Ticket.assignArtisan(ticketId, artisan.id);
      res.json(updatedTicket);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = ticketController;
