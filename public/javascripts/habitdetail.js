// Function to fetch habit data from the API
const token = localStorage.getItem("token");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

async function fetchHabitData() {
    try {
      const response = await fetch("api/seven-day-data", {
        method: "POST",
  
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ habit_id: id }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch habit data');
      }
      const habitData = await response.json();
      return habitData;
    } catch (error) {
      console.error('Error fetching habit data:', error);
      return null;
    }
  }

  function getDayName(date) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek[date.getDay()];
}


generateHeader()

function generateHeader() {
  const habitTable = document.getElementById('habitTable');
  habitTable.innerHTML = '';

  // Create the table header row with day names
  const headerRow = document.createElement('tr');
  const habitNameHeader = document.createElement('th');
  habitNameHeader.textContent = 'Habit';
  headerRow.appendChild(habitNameHeader);

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  for (let i = 0; i < 7; i++) {
    const dateKey = new Date(today);
    dateKey.setDate(today.getDate() - i);

    const dayNameHeader = document.createElement('th');
    dayNameHeader.textContent = getDayName(dateKey); 
    headerRow.appendChild(dayNameHeader);
  }

  habitTable.appendChild(headerRow);
}

  
  function populateHabitTable(habitData,completedDays,totalDays) {
    const habitTable = document.getElementById('habitTable');
    const habitTableBody = document.createElement('tbody');
    const habitDateElement = document.getElementById('habitDate');
    const habitStreakElement = document.getElementById('habitStreak');
    habitDateElement.textContent = `Habit Tracker - ${habitData.habitName}`;
  
    const habits = habitData.isCompleted;
    const dates = habitData.dates;
  
    // Create a single row for each habit
    const habitRow = document.createElement('tr');
    const habitNameCell = document.createElement('td');
  
    habitNameCell.textContent = habitData.habitName;
    habitRow.appendChild(habitNameCell);
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of the day (00:00:00.000)
  
    // Loop through the last 7 days
    for (let i = 0; i < 7; i++) {
      const dateKey = new Date(today);
      dateKey.setDate(today.getDate() - i);
  
      const habitStatusCell = document.createElement('td');
      const icon = document.createElement('i');
  
      // Check if the date exists in the habit data
      const dateIndex = dates.findIndex((date) => new Date(date).toISOString() === dateKey.toISOString());
  
      if (dateIndex !== -1) {
        // If date exists, set status based on isCompleted value
        const status = habits[dateIndex];
        icon.classList.add('icon', status ? 'completed-icon' : 'not-completed-icon');
        icon.classList.add('fas', status ? 'fa-check' : 'fa-times');
      } else {
        // If date does not exist, set status as not completed
        icon.classList.add('icon', 'not-completed-icon');
        icon.classList.add('fas', 'fa-times');
      }
  
      habitStatusCell.appendChild(icon);
      habitRow.appendChild(habitStatusCell);
    }
  
    habitTableBody.appendChild(habitRow);
    habitTable.appendChild(habitTableBody)
    habitStreakElement.textContent = totalDays>7?  `Your Streak => ${completedDays}/${totalDays}`: `Your Streak => ${completedDays}/7`;
  }
  
  
  
  // Entry point to dynamically create the page
  async function createHabitTrackerPage() {
    try {
      const habitData = await fetchHabitData();
      if (!habitData) {
        throw new Error('Failed to fetch habit data');
      }
      populateHabitTable(habitData.data,habitData.completedDays,habitData.totalDays);
    } catch (error) {
      console.error('Error creating Habit Tracker page:', error);
    }
  }
  
  // Call the entry point function to create the page
  createHabitTrackerPage();
  