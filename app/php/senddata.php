<?php

	$data = $_GET['data'];
	$dir = "/tmp/".$_GET['filename'];
	file_put_contents($dir, $data);
	echo "File created successfully at ".$dir."\n";
	return $output;