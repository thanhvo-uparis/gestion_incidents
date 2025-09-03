const form = document.getElementById("ticketForm");
const ticketList = document.getElementById("ticketList");

function showTicketModal(ticket) {
  const modal = document.getElementById("ticketModal");
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <div><b>ID:</b> ${ticket.id}</div>
    <div><b>Type:</b> ${ticket.type_incident}</div>
    <div><b>Status:</b> ${ticket.status}</div>
    <div><b>Locataire ID:</b> ${ticket.locataire_id}</div>
    <div><b>Description:</b> ${ticket.description}</div>
  `;
  modal.style.display = "flex";
}

// Đóng modal
document.getElementById("closeModal").onclick = function() {
  document.getElementById("ticketModal").style.display = "none";
};

// Đóng modal khi click ra ngoài
window.onclick = function(event) {
  const modal = document.getElementById("ticketModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Load danh sách tickets
async function loadTickets() {
  const tickets = await getTickets();
  ticketList.innerHTML = "";

  tickets.forEach(ticket => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="heading-infos">
        <span>ID:</span> ${ticket.id} | 
        <span>Type:</span> ${ticket.type_incident} | 
        <span>Status:</span> <span style="color:${ticket.status === "new" ? "red" : ticket.status === "assigned" ? "orange" : "green"}">${ticket.status}</span>
      </div>
      <div class="btn-actions">
        <button class="btn-item" onclick="assign(${ticket.id})">Assigner Artisan</button>
        <button class="btn-item" onclick="markResolved(${ticket.id})">Marquer Résolu</button>
      </div>
      <div class="footer">
        <button class="btn-item btn-details" onclick="showTicketModal(${encodeURIComponent(JSON.stringify(ticket))})">Details</button>
      </div>
    `;
    // Sửa lại nút Details để truyền dữ liệu ticket
    li.querySelector(".btn-details").onclick = () => showTicketModal(ticket);
    ticketList.appendChild(li);
  });
}

// Xử lý form submit → tạo ticket mới
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const locataireId = parseInt(document.getElementById("locataireId").value);
  const type_incident = document.getElementById("typeIncident").value;
  const description = document.getElementById("description").value;
  
  try {
    const res = await fetch(`http://localhost:5000/tickets`, {
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
