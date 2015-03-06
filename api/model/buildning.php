<?php
namespace api\model;

/**
 * Class Buildning
 * @package app\model
 */
Class Building{
	/**
	 * @var
	 */
	private $name;
	/**
	 * @var
	 */
	private $model;
	/**
	 * @var
	 */
	private $errors;
	/**
	 * @var
	 */
	private $date;
	/**
	 * @var
	 */
	private $dateFormat;

	/**
	 * @var string
	 */
	private $storage;

	/**
	 *
	 */
	public function __construct(){
		$this->dateFormat = 'Y-m-d';
		$this->setDate(Date($this->dateFormat));
		$this->errors = array();
		$this->storage = './db.json';
	}

	/**
	 * @param $name
	 * @return bool
	 */
	public function setName($name){
		$errors = array();
		$key = 'name';
		if($name != '') {
			if(strlen($name) <= 50) {
				if(!$this->modelExists($name)) {
					$this->removeError($key);
					$this->name = $name;
					return true;
				}else{
					$errors[] = 'A buildning with that name already exists';
				}
			}else{
				$errors[] = 'Your name can maximum have 10 characters';
			}
		}else{
			$errors[] = 'Your name can not be empty';
		}
		$this->addError($key, $errors);
		return false;
	}

	/**
	 * @param $model
	 * @return bool
	 */
	private function validateCubes($model){
		$modelarray = json_decode($model, true);
		$cube = new Cube($modelarray['baseSize'], $modelarray['step']);
		for($i = 0; $i < count($modelarray['cubes']); $i++){
			if(!$cube->set($modelarray['cubes'][$i])){
				return false;
			}
		}
		return true;
	}

	/**
	 * @param $model
	 * @return bool
	 */
	public function setModel($model){
		$errors = array();
		$key = 'model';
		if(strlen($model) >= 65) {
			if($this->validateCubes($model)) {
				$this->removeError($key);
				$this->model = \LZString::compressToBase64($model);
				return true;
			}else{
				$errors[] = 'All cubes are not in a correct position';
			}
		}else{
			$errors[] = 'Your  model can minimum have 65 characters';
		}
		$this->addError($key, $errors);
		return false;
	}

	/**
	 * @param $date
	 * @return bool
	 */
	private function setDate($date){
		$errors = array();
		$key = 'date';
		$date = \DateTime::createFromFormat($this->dateFormat, $date);
		if ($date && !is_null($date)) {
			$this->removeError($key);
			$this->date = $date;
			return true;
		}else{
			$errors[] = 'That date have not a correct date format';
		}
		$this->addError($key, $errors);
		return false;
	}

	/**
	 * @return bool
	 */
	public function haveErrors(){
		return (count($this->getErrors()) > 0);
	}

	/**
	 * @return mixed
	 */
	public function getErrors(){
		return $this->errors;
	}

	/**
	 * @param $key
	 * @param $value
	 */
	private function addError($key, $value){
		$this->errors[$key] = $value;
	}

	/**
	 * @param $key
	 */
	private function removeError($key){
		unset($this->errors[$key]);
	}

	/**
	 * @return string
	 */
	public function save(){
		$array = $this->getAll();
		if(!is_null($this->model) && !is_null($this->name)) {
			$array[$this->name] = array('model' => $this->model, 'date' => $this->date->format($this->dateFormat));
			return $this->checkDate($array);
		}
		return false;
	}

	/**
	 * @param $array
	 * @return bool
	 */
	private function saveToFile($array){
		if(count($array) > 0) {
			if(@file_put_contents($this->storage, json_encode($array)) !== false) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @return mixed
	 */
	public function getAll(){
		$all = json_decode(@file_get_contents($this->storage),true);
		if(is_array($all)){
			return $all;
		}
		return array();
	}

	/**
	 * @param $id
	 * @return bool
	 */
	private function modelExists($id){
		return array_key_exists($id, $this->getAll());
	}

	/**
	 * @param $all
	 * @return bool
	 */
	private function checkDate($all){
		$new = array();
		foreach($all as $key => $model){
			$date = \DateTime::createFromFormat($this->dateFormat, $model['date']);
			$interval = new \DateInterval('P30D');
			$date->add($interval);
			if($date >= new \DateTime("now")){
				$new[$key] = $model;
			}
		}
		return $this->saveToFile($new);
	}

	/**
	 * @param $id
	 * @return bool
	 */
	public function get($id){
		$model = $this->getAll();
		if($this->modelExists($id)) {
			$model[$id]['date'] = Date($this->dateFormat);
			if($this->saveToFile($model)) {
				return $model[$id];
			}
		}
		return false;
	}

	public function getCurretBuilding(){
		return json_encode(array( $this->name => array('model' => $this->model, 'date' => $this->date->format($this->dateFormat))));
	}
}