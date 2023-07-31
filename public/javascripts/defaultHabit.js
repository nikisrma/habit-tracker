const token = localStorage.getItem("token");
function toggleSelection(item) {
  item.classList.toggle("selected");
}

function skip() {
  window.location.href = "/my-habit";
}

async function next() {
  try {
    const selectedHabits = Array.from(
      document.querySelectorAll(".flex-item.selected")
    ).map((item) => item.querySelector(".text").textContent.trim());

    if (selectedHabits.length == 0) {
      return swal("Error", "Select at least one habit", "error");
    }

    const response = await fetch("api/add-default-habit", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ habits: selectedHabits }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return swal("Error", responseData.message, "error");
    }
    if (responseData.status == 1) {
      window.location.href = "/my-habit";
      swal("Success", "Habits Added Succesfully", "success");
    } else {
      swal("Error", responseData.message, "error");
    }
  } catch (error) {
    window.location.href = "/"
    swal("Error", "Something went wrong ! Please try again later.", "error");
  }
}
