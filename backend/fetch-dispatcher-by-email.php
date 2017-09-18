<?php
  // Fetch dispatcher by email
  header("Access-Control-Allow-Origin: *");

  // Connect to db
  require_once('connect.php');

  // Get data
  $email = $_POST['email'];
  $users = [];

  // Insert dispatcher
  $sql = "SELECT ID, name, email, password FROM dispatchers WHERE email = '$email'";
  $result = $conn->query($sql);
  if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
      $array = array("ID"=>$row["ID"], "name"=>$row["name"], "email"=>$row["email"], "password"=>$row["password"] );
      array_push($users, $array);
    }
  } else {
    $users = '0 results';
  }

  echo json_encode($users);

  $conn->close();
?>