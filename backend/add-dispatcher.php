<?php
  // Add dispatcher
  header("Access-Control-Allow-Origin: *");

  // Connect to db
  require_once('connect.php');

  // Get data
  $name = $_POST['name'];
  $email = strtolower($_POST['email']);
  $password = $_POST['password'];

  $response = [];

  // Insert dispatcher
  $sql = "INSERT INTO dispatchers (name, email, password) VALUES ('$name', '$email', '$password')";
  if($conn->query($sql) === TRUE){
    array_push($response, ['code'=>'200', 'response'=>'Successfully added']);
  } else {
    array_push($response, ['code'=>'500', 'response'=>"Error: " . $sql . "<br>" . $conn->error]);
  }

  echo $response;
  
  $conn->close();
?>