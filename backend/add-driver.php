<?php
  // Add driver
  header("Access-Control-Allow-Origin: *");
  
  // Connect to db
  require_once('connect.php');

  // Get data
  $name = $_POST['name'];
  $email = strtolower($_POST['email']);
  $password = $_POST['password'];

  $response = [];

  // Insert dispatcher
  $sql = "INSERT INTO drivers (name, email, password) VALUES ('$name', '$email', '$password')";
  if($conn->query($sql) === TRUE){
    array_push($response, ['code'=>'200', 'response'=>'Successfully added']);
  } 
    array_push($response, ['code'=>'500', 'response'=>"Error: " . $sql . "<br>" . $conn->error]);
  }

  echo json_encode($response);

  $conn->close();
?>