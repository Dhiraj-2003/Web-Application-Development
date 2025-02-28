const API_URL = "https://jsonplaceholder.typicode.com/users";

// Fetch and store data in localStorage
const fetchData = async () => {
  try {
    let response = await fetch(API_URL);
    let users = await response.json();
    localStorage.setItem("users", JSON.stringify(users));
    displayData();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Display data in the table
const displayData = () => {
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.forEach((user, index) => {
    tbody.innerHTML += `
      <tr>
          <td>${index + 1}</td>
          <td>${user.name}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.address?.city || "N/A"}</td>
      </tr>`;
  });
};

// Form submission handler
document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  let name = document.getElementById("name").value.trim();
  let username = document.getElementById("username").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let city = document.getElementById("city").value.trim();

  // Validation
  if (!name || !username || !email || !phone || !city) {
    alert("All fields are required.");
    return;
  }

  let user = { name, username, email, phone, address: { city } };

  try {
    let response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      storedUsers.unshift(user); // Add new user at the top
      localStorage.setItem("users", JSON.stringify(storedUsers));
      displayData();

      // Close modal manually using jQuery
      $("#userModal").modal("hide");

      // Reset form
      document.getElementById("userForm").reset();

      alert("User added successfully (Note: Data is only stored locally).");
    }
  } catch (error) {
    console.error("Error posting data:", error);
  }
});

// Initial fetch
fetchData();
