<?php

	$data = $_POST['data'];
	$dir = "/tmp/".$_POST['filename'];
	file_put_contents($dir, $data);
	echo "File created successfully at ".$dir."\n";
	return $output;