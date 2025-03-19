<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = htmlspecialchars($_POST['name']);
    $supervisor = htmlspecialchars($_POST['supervisor']);
    $hobby = htmlspecialchars($_POST['hobby']);
    $gift = htmlspecialchars($_POST['gift']);

    // Validate inputs (basic example)
    if (empty($name) || empty($supervisor) || empty($hobby) || empty($gift)) {
        echo "did you finish filling out the form? ";
        exit;
    }

    // Process the data (e.g., save to database, send email, etc.)
    // For now, we'll just display the submitted data
    echo "<h1>your worries have now been washed away</h1>";

    // Example: Send an email (requires proper email configuration)
    
    $to = "helenlinart@gmail.com";
    $subject = "New Form Submission";
    $body = "name: $name\nsupervisor: $supervisor\nhobby: $hobby\ngift: $gift";
    $headers = "from \'a melting point\'";

    if (mail($to, $subject, $body, $headers)) {
        echo "<p>Thank you for your message. We will get back to you soon!</p>";
    } else {
        echo "<p>Sorry, there was an error sending your message. Please try again later.</p>";
    }
    
} else {
    // If the form is not submitted, redirect to the form page
    header("Location: latrine.html");
    exit;
}
?>