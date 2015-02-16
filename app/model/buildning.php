<?php
namespace app\model;

/**
 * Class Buildning
 * @package app\model
 */
Class Buildning{
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
	 *
	 */
	public function __constuct(){
		$this->dateFormat = 'Y-m-d';
		$this->setDate(Date($this->dateFormat));
		$this->errors = array();
	}

	/**
	 * @param $name
	 * @return bool
	 */
	public function setName($name){
		$errors = array();
		$key = 'name';
		if($name != '') {
			if(strlen($name) <= 10) {
				$this->removeError($key);
				$this->name = $name;
				return true;
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
	public function setModel($model){
		$errors = array();
		$key = 'model';
		if(strlen($model) >= 65) {
			$this->removeError($key);
			$this->model = $model;
			return true;
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
		$date = DateTime::createFromFormat($this->dateFormat, $date);
		if ($date) {
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
	public function getJson(){
		return json_encode(array('name' => $this->name, 'model' => $this->model, 'date' => $this->date));
	}

	/**
	 * @param $json
	 */
	public function loadJson($json){
		$model = json_decode($json, true);
		$this->setName($model['name']);
		$this->setModel($model['model']);
		$this->setDate($model['date']);
	}
}