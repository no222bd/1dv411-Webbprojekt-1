<?php
namespace app\model;

/**
 * Class Cube
 * @package app\model
 */
Class Cube{
	/**
	 * @var
	 */
	private $color;
	/**
	 * @var
	 */
	private $x;
	/**
	 * @var
	 */
	private $y;
	/**
	 * @var
	 */
	private $z;

	/**
	 * @var float
	 */
	private $base;
	/**
	 * @var float
	 */
	private $step;

	/**
	 * @param $base
	 * @param $step
	 * @throws \Exception
	 */
	public function __construct($base, $step){
		if(!is_null($base) && !is_null($step)){
			$this->step = floor($step);
			$this->base = floor($base) * $this->step;
		}else{
			Throw new \Exception();
		}
	}

	/**
	 * @param $position
	 * @param $type
	 * @return int
	 * @throws \Exception
	 */
	private function validatePosition($position, $type){
		if($type == 'z' || $type == 'x'){
			$range = range((0-($this->base - $this->step)), ($this->base - $this->step), $this->step);
			$valid = in_array($position, $range) && ($position % $this->step == 0);
		}elseif($type == 'y'){
			$valid = $position >= $this->step && $position <= ($this->base -  $this->step) && ($position % $this->step == 0);
		}else{
			Throw new \Exception();
		}
		return $valid;
	}

	/**
	 * @param $color
	 * @return bool
	 */
	private function validateColor($color){
		if(preg_match("([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})", $color)){
			return true;
		}
		return false;
	}

	/**
	 * @param $cubes
	 * @return bool
	 */
	public function set($cubes){
		try {
			foreach($cubes as $key => $value) {
				$valid = false;
				if($key != 'color') {
					$valid = $this->validatePosition($value, $key);
				} else {
					$valid = $this->validateColor($value);
				}
				if($valid) {
					$this->$key = $value;
				} else {
					Throw new \Exception();
				}
			}
			return true;
		} catch (\Exception $e){
			return false;
		}
	}

	/**
	 * @return array
	 */
	public function get(){
		return array("color" => $this->color, "x" => $this->x, "y" => $this->y, "z" => $this->z);
	}
}