<?php

function dd($dumpValue){
	die(var_dump($dumpValue));
}

require 'vendor/autoload.php';
new \app\controller\MasterController(new \Silex\Application());