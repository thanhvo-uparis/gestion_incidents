const form = document.getElementById("ticketForm");
const ticketList = document.getElementById("ticketList");

// Load danh sách tickets
async function loadTickets() {
  const tickets = await getTickets();
  ticketList.innerHTML = "";

  tickets.forEach(ticket => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>ID:</b> ${ticket.id} | 
      <b>Type:</b> ${ticket.type_incident} | 
      <b>Status:</b> <span style="color:${ticket.status === "new" ? "red" : ticket.status === "assigned" ? "orange" : "green"}">${ticket.status}</span>
      <br>
      <button onclick="assign(${ticket.id})">Assigner Artisan</button>
      <button onclick="markResolved(${ticket.id})">Marquer Résolu</button>
    `;
    ticketList.appendChild(li);
  });
}

// Xử lý form submit → tạo ticket mới
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const locataireId = parseInt(document.getElementById("locataireId").value);
  const type_incident = document.getElementById("typeIncident").value;
  const description = document.getElementById("description").value;
  console.log(locataireId, type_incident, description);
  
  try {
    const res = await fetch("http://localhost:5000/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locataireId, type_incident, description })
    });

    if (!res.ok) {
      const error = await res.json();
      alert("Lỗi: " + (error.error || "Không thể tạo ticket"));
      return;
    }

    form.reset();
    loadTickets();
  } catch (err) {
    alert("Lỗi kết nối server hoặc mạng!");
    console.error(err);
  }
  form.reset();
  loadTickets();
});

// Gán artisan cho ticket
async function assign(ticketId) {
  await assignArtisan(ticketId);
  loadTickets();
}

// Đánh dấu ticket đã giải quyết
async function markResolved(ticketId) {
  await updateTicketStatus(ticketId, "resolved");
  loadTickets();
}

// Load tickets khi trang mở
loadTickets();
