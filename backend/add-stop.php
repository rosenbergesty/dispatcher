<?php
  // Add stop
  header("Access-Control-Allow-Origin: *");

  // Connect to db
  require_once('connect.php');

  // Get data
  $driverID = $_POST['driverId'];
  $address = $_POST['address'];
  $type = $_POST['action'];
  $size = $_POST['size'];
  $time = $_POST['time'];
  $date = $_POST['date'];

  $response = [];
  
  // Insert dispatcher
  $sql = "INSERT INTO stops (driverID, address, type, size, dateCreated, timeCreated, status) VALUES ('$driverID', '$address', '$type', '$size', '$date', '$time', 'pending')";
  if($conn->query($sql) === TRUE){
    array_push($response, ['code'=>'200', 'response'=>'Successfully added']);
  } else {
    array_push($response, ['code'=>'500', 'response'=>"Error: " . $sql . "<br>" . $conn->error]);
  }

  echo json_encode($response);

  $conn->close();
?>