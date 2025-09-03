const Ticket = require('../models/ticketModel');
const Locataire = require('../models/locataireModel');
const Artisan = require('../models/artisanModel');
const axios = require("axios");

const ticketController = {
  createTicket: async (req, res) => {
    try {
      const { locataireId, type_incident, description } = req.body;
      if (!locataireId || !type_incident || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // 1. Tạo ticket trong DB
      const ticket = await Ticket.create({ locataireId, type_incident, description });

      // 2. Bắn webhook sang n8n
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook-test/new-ticket", {
          ticket_id: ticket.id,
          locataire_id: locataireId,
          type_incident,
          description,
          status: ticket.status
        });
        console.log(`✅ Webhook sent to n8n for ticket ${ticket.id}`);
      } catch (err) {
        console.error("⚠️ Failed to send webhook to n8n:", err.message);
      }

      // 3. Trả kết quả về client
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
