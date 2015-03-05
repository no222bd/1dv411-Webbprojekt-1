<?php
use \api\model;

class BuildingTest extends \App_TestCase {

	protected $building;
	protected $jsonBuilding;
	protected $storage;

	protected function setUp(){
		$this->building = New model\Building();
		$this->storage = './tests/db.json';
		$storage = $this->getPrivateProperty('\api\model\Building', 'storage');
		$storage->setValue($this->building, $this->storage);
		$this->jsonBuilding = array(
			'step' => 25,
			'baseSize' => 20,
			'cubes' => array(
				array('color' => 'e60012', 'x' => -325, 'y' => 25, 'z' => -275)
			)
		);
	}

	protected function tearDown(){
		$storage = $this->getPrivateProperty('\api\model\Building', 'storage');
		$storage = $storage->getValue($this->building);
		if(file_exists($storage)) {
			unlink($storage);
		}
	}

	public function testConstruct(){
		$building = New model\Building();

		$errors = $this->getPrivateProperty('\api\model\Building', 'errors');
		$this->assertTrue(is_array($errors->getValue($building)));

		$storage = $this->getPrivateProperty('\api\model\Building', 'storage');
		$this->assertFalse(is_null($storage->getValue($building)));

		$dateFormat = $this->getPrivateProperty('\api\model\Building', 'dateFormat');
		$dateBuilding = $this->getPrivateProperty('\api\model\Building', 'date');

		$dateFormat = $dateFormat->getValue($building);
		$this->assertEquals('Y-m-d',$dateFormat);

		$dateBuilding = $dateBuilding->getValue($building);
		$this->assertEquals(
			\DateTime::createFromFormat($dateFormat, Date($dateFormat))->format($dateFormat),
			$dateBuilding->format($dateFormat)
		);
	}

	public function testDate(){
		$dateFormat = $this->getPrivateProperty('\api\model\Building', 'dateFormat');
		$dateFormat = $dateFormat->getValue($this->building);

		$setDate = $this->getPrivateMethod('\api\model\Building', 'setDate');
		$this->assertTrue($setDate->invoke($this->building, Date($dateFormat)));
		$this->assertFalse($setDate->invoke($this->building, 'hej'));
		$this->assertTrue(count($this->building->getErrors()) === 1);
	}

	public function testSetName(){
		$name = 'test';

		$this->building->setName($name);
		$NameBuilding = $this->getPrivateProperty('\api\model\Building', 'name');
		$NameBuilding = $NameBuilding->getValue($this->building);

		$this->assertEquals($name, $NameBuilding);

		$this->building->setName('');
		$errors = $this->building->getErrors();
		$this->assertTrue(count($errors) == 1);
		
		$this->building->setName($name.$name.$name);

		$NameBuilding = $this->getPrivateProperty('\api\model\Building', 'name');
		$NameBuilding = $NameBuilding->getValue($this->building);
		$this->assertEquals($name, $NameBuilding);

		$errors = $this->building->getErrors();
		$this->assertTrue(count($errors) == 1);

		$this->testSaveToFile();

		$this->building->setName($name);

		$errors = $this->building->getErrors();
		$this->assertTrue(count($errors) == 1);
	}

	public function testErros(){
		$value =  'test error';
		$key = 'test';
		$this->assertFalse($this->building->haveErrors());
		$addErrors = $this->getPrivateMethod('\api\model\Building', 'addError');
		$addErrors->invoke($this->building, $key, $value);
		$errors = $this->building->getErrors();
		$this->assertEquals($value, $errors[$key]);
		$this->assertTrue($this->building->haveErrors());

		$removeError = $this->getPrivateMethod('\api\model\Building', 'removeError');
		$removeError->invoke($this->building, $key);
		$this->assertFalse($this->building->haveErrors());
	}

	public function testSetModel(){
		$jsonBuilding = $this->jsonBuilding;
		$this->assertTrue($this->building->setModel(json_encode($this->jsonBuilding)));

		$modelBuilding = $this->getPrivateProperty('\api\model\Building', 'model');
		$modelBuilding = $modelBuilding->getValue($this->building);
		$this->assertNull(json_decode($modelBuilding));

		$jsonBuilding['baseSize'] = 1;
		$this->assertFalse($this->building->setModel(json_encode($jsonBuilding)));
		$matchError = preg_match('/position/', $this->building->getErrors()['model'][0]);
		$this->assertTrue($matchError > 0);

		$this->assertFalse($this->building->setModel(json_encode('')));
		$matchError = preg_match('/characters/', $this->building->getErrors()['model'][0]);
		$this->assertTrue($matchError > 0);
	}

	public function testSaveToFile(){
		$dateFormat = $this->getPrivateProperty('\api\model\Building', 'dateFormat');
		$dateFormat = $dateFormat->getValue($this->building);

		$saveToFile = $this->getPrivateMethod('\api\model\Building', 'saveToFile');
		$this->assertFalse($saveToFile->invoke($this->building, array()));

		$building = array('test' => array('model' => $this->jsonBuilding, 'date' => Date($dateFormat)));
		$this->assertTrue($saveToFile->invoke($this->building, $building));

		$storage = json_decode(@file_get_contents($this->storage), true);
		$this->assertEquals($building, $storage);
	}

	public function testGetAll(){
		$this->assertTrue(is_array($this->building->getAll()));
		$this->testSaveToFile();
		$this->assertTrue(count($this->building->getAll()) > 0);
	}

	public function testGet(){
		$this->assertFalse($this->building->get(''));
		$this->testSaveToFile();
		$this->assertTrue(is_array($this->building->get('test')));
	}

	public function testModelExists(){
		$modelExists = $this->getPrivateMethod('\api\model\Building', 'modelExists');
		$this->assertFalse($modelExists->invoke($this->building, ''));
		$this->testSaveToFile();
		$this->assertTrue($modelExists->invoke($this->building, 'test'));
	}

	public function testSave(){
		$this->assertFalse($this->building->save());
		$this->building->setModel(json_encode($this->jsonBuilding));
		$this->building->setName('test');
		$this->assertTrue($this->building->save());
	}

	public function testCheckDate(){
		$this->building->setModel(json_encode($this->jsonBuilding));
		$this->building->setName('test');
		$this->building->save();

		$checkDate = $this->getPrivateMethod('\api\model\Building', 'checkDate');
		$this->assertTrue($checkDate->invoke($this->building, $this->building->getAll()));

		$building = array('test' => array('model' => $this->jsonBuilding, 'date' => '2015-01-24'));
		$this->assertFalse($checkDate->invoke($this->building, $building));
	}

	public function testGetCurretBuilding(){
		$dateFormat = $this->getPrivateProperty('\api\model\Building', 'dateFormat');
		$dateFormat = $dateFormat->getValue($this->building);

		$name = 'test';
		$this->building->setModel(json_encode($this->jsonBuilding));
		$this->building->setName($name);
		$this->building->save();
		$building = \LZString::compressToBase64(json_encode($this->jsonBuilding));
		$this->assertEquals(json_encode(array($name => array('model' => $building, 'date' => Date($dateFormat)))),$this->building->getCurretBuilding());
	}

}
