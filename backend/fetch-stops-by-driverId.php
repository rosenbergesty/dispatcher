<?php
  // Fetch stops by driverId
  header("Access-Control-Allow-Origin: *");

  // Connect to db
  require_once('connect.php');

  // Get data
  $driverID = $_POST['driverID'];
  
  $response = [];

  // Insert dispatcher
  $sql = "SELECT * FROM stops WHERE driverID = '$driverID'";
  $result = $conn->query($sql);
  if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
      $array = array("ID"=>$row["ID"], "address"=>$row["address"], "type"=>$row["type"], "size"=>$row["size"], "date"=>$row["dateCreated"], "time"=>$row["timeCreated"], "status"=>$row["status"] );
      array_push($response, $array);
    }
  } else {
    $response = '0 results';
  }

  echo json_encode($response);

  $conn->close();
?>