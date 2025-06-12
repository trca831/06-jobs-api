// Import the needed variables and functions from other files
import { enableInput, inputEnabled, message, token } from "./index.js";
import { showJobs } from "./jobs.js";

// This function sets up the delete button functionality
export const handleDelete = () => {
  // Listen for any clicks on the page
  document.addEventListener("click", async (event) => {
    // Only continue if input is enabled AND the clicked element has the class 'deleteButton'
    if (!inputEnabled || !event.target.classList.contains("deleteButton")) {
      return; // If not, stop here and do nothing
    }

    // Disable inputs so the user can’t click anything else while we process
    enableInput(false);

    // Get the ID of the job we want to delete from the button's data-id attribute
    const jobId = event.target.dataset.id;

    try {
      // Make a DELETE request to the API to delete the job
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "DELETE", // Tell the server we want to delete something
        headers: {
          "Content-Type": "application/json", // We are sending JSON
          Authorization: `Bearer ${token}`, // Add the user's token so the server knows who is deleting
        },
      });

      // Convert the response to JSON
      const data = await response.json();

      // If the server says the delete was successful (status code 200)
      if (response.status === 200) {
        message.textContent = "Job entry was deleted."; // Show a success message
        showJobs(); // Refresh the list of jobs on the page
      } else {
        // If the delete failed, show the error message from the server or a default one
        message.textContent = data.msg || "Job entry not deleted";
      }
    } catch (error) {
      // If something went wrong (like no internet), show a general error message
      console.log(error);
      message.textContent = "A communication error occurred.";
    }

    // Re-enable input so the user can interact with the page again
    enableInput(true);
  });
};