<?php
use \app\model;

class BuildingTest extends \App_TestCase {

	protected $building;

	protected function setUp(){
		$this->building = New model\Building();
		$storage = $this->getPrivateProperty('\app\model\Building', 'storage');
		$storage->setValue($this->building, './tests/db.json');
	}

	protected function tearDown(){
		$storage = $this->getPrivateProperty('\app\model\Building', 'storage');
		$storage = $storage->getValue($this->building);
		unset($storage);
	}

	public function testConstruct(){
		$building = New model\Building();

		$errors = $this->getPrivateProperty('\app\model\Building', 'errors');
		$this->assertTrue(is_array($errors->getValue($building)));

		$storage = $this->getPrivateProperty('\app\model\Building', 'storage');
		$this->assertFalse(is_null($storage->getValue($building)));

		$dateFormat = $this->getPrivateProperty('\app\model\Building', 'dateFormat');
		$dateBuilding = $this->getPrivateProperty('\app\model\Building', 'date');

		$dateFormat = $dateFormat->getValue($building);
		$this->assertEquals('Y-m-d',$dateFormat);

		$dateBuilding = $dateBuilding->getValue($building);
		$this->assertEquals(
			\DateTime::createFromFormat($dateFormat, Date($dateFormat))->format($dateFormat),
			$dateBuilding->format($dateFormat)
		);
	}

	public function testDate(){
		$dateFormat = $this->getPrivateProperty('\app\model\Building', 'dateFormat');
		$dateFormat = $dateFormat->getValue($this->building);

		$setDate = $this->getPrivateMethod('\app\model\Building', 'setDate');
		$this->assertTrue($setDate->invoke($this->building, Date($dateFormat)));
		$this->assertFalse($setDate->invoke($this->building, 'hej'));
		$this->assertTrue(count($this->building->getErrors()) === 1);
	}

	public function testSetName(){
		$name = 'test';

		$this->building->setName($name);
		$NameBuilding = $this->getPrivateProperty('\app\model\Building', 'name');
		$NameBuilding = $NameBuilding->getValue($this->building);

		$this->assertEquals($name, $NameBuilding);

		$this->building->setName('');
		$errors = $this->building->getErrors();
		$this->assertTrue(count($errors) == 1);

		$this->building->setName($name+$name+$name);

		$NameBuilding = $this->getPrivateProperty('\app\model\Building', 'name');
		$NameBuilding = $NameBuilding->getValue($this->building);
		$this->assertEquals($name, $NameBuilding);

		$errors = $this->building->getErrors();
		$this->assertTrue(count($errors) == 1);
	}



}
