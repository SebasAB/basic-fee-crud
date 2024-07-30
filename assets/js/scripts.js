document.addEventListener("DOMContentLoaded", function () {
  loadPreviousTickets();
});

document.getElementById("previewBtn").addEventListener("click", function () {
  const artist = document.getElementById("artist").value;
  const tour = document.getElementById("tour").value;
  const section = document.getElementById("section").value;
  const row = document.getElementById("row").value;
  const seat = document.getElementById("seat").value;
  const hour = document.getElementById("hour").value;

  let isValid = true;
  [...document.querySelectorAll("input")].forEach((input) => {
    if (!input.value) {
      input.classList.add("is-invalid");
      isValid = false;
    } else {
      input.classList.remove("is-invalid");
    }
  });

  if (!isValid) return;

  const ticketPreview = document.getElementById("ticketPreview");
  ticketPreview.innerHTML = "<p>Generating ticket...</p>";

  setTimeout(() => {
    const code = generateCode();
    ticketPreview.innerHTML = `
          <div class="ticket-content">
              <h4>${artist}</h4>
              <p>Tour: ${tour}</p>
              <p>Section: ${section}, Row: ${row}, Seat: ${seat}</p>
              <p>Hour: ${hour}</p>
              <div class="barcode"></div>
              <p>Code: ${code}</p>
          </div>
      `;

    saveTicket({ artist, tour, section, row, seat, hour, code });
    loadPreviousTickets();
  }, 2000);
});

document.getElementById("clearBtn").addEventListener("click", function () {
  document.getElementById("ticketForm").reset();
  document.getElementById("ticketPreview").innerHTML =
    "<p>Fill in the form to preview the ticket.</p>";
  [...document.querySelectorAll("input")].forEach((input) => {
    input.classList.remove("is-invalid");
  });
});

document
  .getElementById("clearStorageBtn")
  .addEventListener("click", function () {
    localStorage.removeItem("tickets");
    loadPreviousTickets();
    document.getElementById("ticketPreview").innerHTML =
      "<p>Fill in the form to preview the ticket.</p>";
  });

document
  .getElementById("ticketsDropdown")
  .addEventListener("change", function () {
    const index = this.value;
    showTicket(index);
  });

function generateCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function saveTicket(ticket) {
  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets.push(ticket);
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

function loadPreviousTickets() {
  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  const ticketsDropdown = document.getElementById("ticketsDropdown");

  ticketsDropdown.innerHTML =
    '<option value="">Select a previous ticket</option>';

  if (tickets.length === 0) {
    ticketsDropdown.innerHTML +=
      '<option value="">No previous tickets</option>';
    return;
  }

  tickets.forEach((ticket, index) => {
    ticketsDropdown.innerHTML += `<option value="${index}">${ticket.artist} - ${ticket.tour}</option>`;
  });
}

function showTicket(index) {
  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  if (index < 0 || index >= tickets.length) return;

  const ticket = tickets[index];
  const ticketPreview = document.getElementById("ticketPreview");
  ticketPreview.innerHTML = `
      <div class="ticket-content">
          <h4>${ticket.artist}</h4>
          <p>Tour: ${ticket.tour}</p>
          <p>Section: ${ticket.section}, Row: ${ticket.row}, Seat: ${ticket.seat}</p>
          <p>Hour: ${ticket.hour}</p>
          <div class="barcode"></div>
          <p>Code: ${ticket.code}</p>
      </div>
  `;
}
