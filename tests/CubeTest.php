<?php
use \app\model;

class CubeTest extends \App_TestCase {

	public function testConstruct(){

		try {
			New model\Cube(null, null);
		} catch (\Exception $e){
			return;
		}

		$this->fail('An expected exception has not been raised.');

	}

}
