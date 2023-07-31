const token = localStorage.getItem("token");

async function addHabitSubmit() {
    try {
    const habit = document.getElementById("habit").value;
  
    if (!habit || !habit.trim()) {
      swal("Error", "Please enter a a habit", "error");
      return;
    }
  
    let data ={
        habit:habit,
    }
      const response = await fetch(
        "api/add-habit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
  
      const responseData = await response.json();
  
      if (!response.ok) {
        return swal("Error", responseData.message, "error");
      }
      if (responseData.status == 1) {
        window.location.href = "/my-habit";
        swal("Success", "Habit added successful!", "success");
      } else {
        swal("Error", responseData.message, "error");
      }
    } catch (error) {
      swal("Error", "Something went wrong ! Please try again later.", "error");
    }
  }