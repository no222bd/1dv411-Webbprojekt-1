<?php

function dd($dumpValue){
	die(var_dump($dumpValue));
}

require '../vendor/autoload.php';
new \api\controller\MasterController(new \Silex\Application());