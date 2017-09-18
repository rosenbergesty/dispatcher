<?php

  // Connect to database
  require_once('connect.php');

  // Create dispatchers table
  $sql = "CREATE TABLE dispatchers (ID INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL,
    password VARCHAR(240))";

  if($conn->query($sql) === TRUE){
    echo "Created dispatchers.";
  } else {
    echo "Error creating dispatchers: " . $conn->error;
  }

  // Create drivers table
  $sql = "CREATE TABLE drivers (ID INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL,
    password VARCHAR(240))";

  if($conn->query($sql) === TRUE){
    echo "Created drivers.";
  } else {
    echo "Error creating drivers: " . $conn->error;
  }


  // Create stops table
  $sql = "CREATE TABLE stops (ID INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    driverId INT(6) NOT NULL,
    address VARCHAR(240) NOT NULL,
    type VARCHAR(3) NOT NULL,
    size INT(3) NOT NULL, 
    containerNum VARCHAR(30), 
    containerNum2 VARCHAR(30),
    borough VARCHAR(30),
    comments TEXT,
    signature VARCHAR(240),
    dateCreated VARCHAR(240),
    timeCreated VARCHAR(240),
    dateFulfilled VARCHAR(240),
    timeFulfilled VARCHAR(240),
    status VARCHAR(30))";

  if($conn->query($sql) === TRUE){
    echo "Created stops.";
  } else {
    echo "Error creating stops: " . $conn->error;
  }

  $conn->close();

?>