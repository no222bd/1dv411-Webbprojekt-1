<?php
namespace app\model;

Class Buildning{
	private $name;
	private $model;
	private $errors;
	private $date;
	private $dateFormat;

	public function __constuct(){
		$this->dateFormat = 'Y-m-d';
		$this->setDate(Date($this->dateFormat));
		$this->errors = array();
	}

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

	public function haveErrors(){
		return (count($this->getErrors()) > 0);
	}

	public function getErrors(){
		return $this->errors;
	}

	private function addError($key, $value){
		$this->errors[$key] = $value;
	}

	private function removeError($key){
		unset($this->errors[$key]);
	}

	public function getJson(){
		return json_encode(array('name' => $this->name, 'model' => $this->model, 'date' => $this->date));
	}

	public function loadJson($json){
		$model = json_decode($json, true);
		$this->setName($model['name']);
		$this->setModel($model['model']);
		$this->setDate($model['date']);
	}
}