<?php
use \api\model;

class CubeTest extends \App_TestCase {

	public function testConstruct(){

		try {
			New model\Cube(null, null);
		} catch (\Exception $e){
			return;
		}

		$this->fail('An expected exception has not been raised.');

	}

	public function testValidatePosition(){
		$cube = New model\Cube(10, 25);
		try {
			$validatePosition = $this->getPrivateMethod('\api\model\Cube', 'validatePosition');
			$validatePosition->invoke($cube, 0, 'h');
		} catch(\Exception $e){
			return;
		}
		$this->fail('An expected exception has not been raised.');
	}


	public function testValidateColor(){
		$cube = New model\Cube(10, 25);
		$validatePosition = $this->getPrivateMethod('\api\model\Cube', 'validateColor');
		$this->assertFalse($validatePosition->invoke($cube, '1234'));
	}

	public function testGet(){
		$cube = new model\cube(10, 25);
		$cubeArray = array('x' => 25, 'y' => 25, 'z' => 25, 'color' => 'ff0000');
		$cube->set($cubeArray);

		$this->assertEquals($cube->get(), $cubeArray);

	}

}
