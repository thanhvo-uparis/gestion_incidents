const API_URL = "http://localhost:5000";

// GET - Lấy tất cả tickets
async function getTickets() {
  const res = await fetch(`${API_URL}/tickets`);
  return await res.json();
}

// POST - Tạo ticket mới
async function createTicket(data) {
  const res = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// PATCH - Assign artisan
async function assignArtisan(ticketId) {
  const res = await fetch(`${API_URL}/tickets/${ticketId}/assign`, {
    method: "PATCH"
  });
  return await res.json();
}

// PATCH - Update status
async function updateTicketStatus(ticketId, status) {
  const res = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return await res.json();
}