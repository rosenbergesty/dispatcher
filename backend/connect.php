<?php
  // Connect to database for Guma Apps

  $server = "localhost";
  $username = "estyrose_guma";
  $password = "Pass@guma12";
  $dbname = "estyrose_guma";

  $conn = new mysqli($server, $username, $password, $dbname);

  if($conn->connect_error){
    die("connection failed: " . $conn->connect_error);
  } 

?>