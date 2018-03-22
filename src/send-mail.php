<?php
$from = $_POST['email'] ;
$to = "nbacic@ymail.com";
$subject = "My subject";
$txt = "You can visit my website on: http://www.nbnswebdesign.com/task_1";
$headers = "From: nbacic@ymail";
mail($to,$subject,$txt,$headers) or die("Error!");
?> 