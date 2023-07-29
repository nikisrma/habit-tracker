
async function registerFormSubmit(data) {

    try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    if (!name || !name.trim()) {
        swal("Error", "Please enter a valid email.", "error");
        return;
     }
    if (!email || !email.trim()) {
      swal("Error", "Please enter a valid email.", "error");
      return;
    }
  
    if (!password || !password.trim()) {
      swal("Error", "Please enter your password.", "error");
      return;
    }
    let data ={
        name:name,
      email:email,
      password:password
    }
      const response = await fetch(
        "api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
  
      const responseData = await response.json();
  
      if (!response.ok) {
        return swal("Error", responseData.message, "error");
      }
      if (responseData.status == 1) {
        localStorage.setItem("token", responseData.data.token);
        window.location.href = "/";
        swal("Success", "Regsitered successful!", "success");
      } else {
        swal("Error", responseData.message, "error");
      }
    } catch (error) {
      swal("Error", "Something went wrong ! Please try again later.", "error");
    }
  }