document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const loader = document.getElementById("loader");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop default form submission

    loader.style.display = "flex"; // show loader

    try {
      const formData = new FormData(form);

      // Convert FormData to URL-encoded format (so Express can read it)
      const params = new URLSearchParams();
      for (const pair of formData) {
        params.append(pair[0], pair[1]);
      }

      const resp = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
      });

      loader.style.display = "none"; // hide loader

      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Sent!",
            text: "Your product was sent to Telegram.",
            confirmButtonColor: "#007bff"
          });
          form.reset();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.error || "Failed to send notification.",
            confirmButtonColor: "#d33"
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Server error occurred.",
          confirmButtonColor: "#d33"
        });
      }
    } catch (err) {
      loader.style.display = "none"; // hide loader on exception too
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unexpected error occurred.",
        confirmButtonColor: "#d33"
      });
      console.error(err);
    }
  });
});
