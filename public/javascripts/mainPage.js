const token = localStorage.getItem("token");

function getCurrentDate(date = new Date()) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

// Function to display circle-container elements
function displayCircleContainers() {
  const circleContainerWrapper = document.getElementById(
    "circle-container-wrapper"
  );
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  for (
    let date = new Date(sevenDaysAgo);
    date <= today;
    date.setDate(date.getDate() + 1)
  ) {
    const dayInitial = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .charAt(0);
    const dayDate = date.getDate();

    // Create circle-container element
    const circleContainer = document.createElement("div");
    circleContainer.classList.add("circle-container");

    const circle = document.createElement("div");
    circle.classList.add("circle");
    circle.textContent = dayInitial;
    circleContainer.appendChild(circle);

    const dayDateElement = document.createElement("div");
    dayDateElement.classList.add("day-date");
    dayDateElement.textContent = dayDate;
    circleContainer.appendChild(dayDateElement);

    // Append circle-container element to the wrapper
    circleContainerWrapper.appendChild(circleContainer);
  }

  // Set the selected circle for the current date
  setSelectedCircleForCurrentDate();
}

function setSelectedCircleForCurrentDate() {
  const currentDate = new Date();
  const dayDate = currentDate.getDate();

  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => {
    const circleDate = Number(circle.nextSibling.textContent);
    if (circleDate === dayDate) {
      circle.classList.add("selected");
    } else {
      circle.classList.remove("selected");
    }
  });
}

/*** get dynamic habit list container */
const habitListContainer = document.getElementById("dynamic-habit-list");

/** Get habits for current date */
async function getHabits() {
  try {
    const response = await fetch("api/get-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    if (!response.ok) {
      return swal("Error", responseData.message, "error");
    }
    if (responseData.status == 1) {
      const habitData = responseData.data;
      // const date = getCurrentDate();
      const date = new Date();
      habitData.forEach((habit) => {
        addHabit(habit, date);
      });
    } else {
      swal("Error", responseData.message, "error");
    }
  } catch (error) {
    window.location.href = "/"
    swal("Error", "Something went wrong ! Please try again later.", "error");
  }
}


function addHabit(habit, date) {
  const newHabitItem = document.createElement("li");
  newHabitItem.classList.add("habit-item");

  // const newHabitSpan = document.createElement("span");
  // newHabitSpan.textContent = habit.habit_id.name;
  // newHabitItem.appendChild(newHabitSpan);

  const newHabitLink = document.createElement("a");
  newHabitLink.textContent = habit.habit_id.name;
  newHabitLink.href = `habit-detail?id=${habit.habit_id._id}`;
  newHabitItem.appendChild(newHabitLink); 

  const newHabitCheckbox = document.createElement("input");
  newHabitCheckbox.type = "checkbox";
  newHabitCheckbox.classList.add("habit-checkbox");
  newHabitCheckbox.id = habit._id;
  if (habit.isCompleted) {
    newHabitCheckbox.checked = true;
  }
  newHabitCheckbox.addEventListener("change", (event) => {
    const isCompleted = habit.isCompleted;
    const habit_id = habit._id;
    updateHabitStatus(date, isCompleted, habit_id);
  });
  newHabitItem.appendChild(newHabitCheckbox);

  const newHabitLabel = document.createElement("label");
  newHabitLabel.setAttribute("for", newHabitCheckbox.id);
  newHabitItem.appendChild(newHabitLabel);

  habitListContainer.appendChild(newHabitItem);
}

async function fetchHabitsForDay(event) {
  if (event.target.classList.contains("circle")) {
    const circles = document.querySelectorAll(".circle");
    circles.forEach((circle) => {
      circle.classList.remove("selected");
    });
    // Get the selected date from the clicked circle
    const selectedDayDate = event.target.nextSibling.textContent;
    const currentDate = new Date();
    currentDate.setDate(selectedDayDate);
    // let formattedDate = getCurrentDate(currentDate);

    try {
      // Call the API to fetch habits for the selected day
      const response = await fetch("api/get-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: currentDate }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch habits for the selected day.");
      }

      // Parse the API response to get the habits for the selected day
      const responseData = await response.json();

      const habitDataForDay = responseData.data;
      // Get the habit list container
      const habitListContainer = document.getElementById("dynamic-habit-list");

      // Clear the existing habit list
      habitListContainer.innerHTML = "";

      habitDataForDay.forEach((habit) => {
        addHabit(habit, currentDate);
      });
      event.target.classList.add("selected");
    } catch (error) {
      console.error("Error fetching habits for the selected day:", error);
    }
  }
}

// Function to update the habit status via API call
async function updateHabitStatus(date, isCompleted, habit_id) {
  try {
    const response = await fetch("/api/change-habit-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date,
        isCompleted,
        _id: habit_id,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      swal("Error", responseData.message, "error");
    } else {
      swal("Success", responseData.message, "success");
    }
  } catch (error) {
    console.error("Error updating habit status:", error);
    swal("Error", "Something went wrong! Please try again later.", "error");
  }
}
displayCircleContainers();
getHabits();
