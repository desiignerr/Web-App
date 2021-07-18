<?php

mysql_connect("127.0.0.1:5500","root","");
mysql_select_db("comments");

$name = $_POST["name"];
$comment = $_POST["comment"];

$comment_lenght = strlen($comment);

if($comment_lenght > 100)
{
    header("location: index.php?error=1")
}
else
{
    mysql_query("INSERT INTO comments VALUES('','$name','$comment')");
    header("location: index.php");    
}