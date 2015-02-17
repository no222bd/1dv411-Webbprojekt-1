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
		$base = floor($base);
		$step = floor($step);
		if(!is_null($base) && !is_null($step)){
			$this->base = $base;
			$this->step = $step;
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
		$valid = false;
		$range = range((0-($this->base - $this->step)), ($this->base - $this->step), $this->step);
		switch($type){
			case 'z':
				if(in_array($position, $range) && ($position % $this->step == 0)){
					$valid = true;
				}
				break;
			case 'x':
				if(in_array($position, $range) && ($position % $this->step == 0)){
					$valid = true;
				}
				break;
			case 'y':
				if($position >= $this->step && $position <= ($this->base -  $this->step) && ($position % $this->step == 0)){
					$valid = true;
				}
				break;
			default:
				Throw new \Exception();
				break;
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
	 * @param $cube
	 */
	public function set($cubes){
		try {
			foreach($cubes as $key => $value) {
				if($key != 'color') {
					if($this->validatePosition($value, $key)) {
						$this->$key = $value;
					} else {
						Throw new \Exception();
					}
				} else {
					if($this->validateColor($value)){
						$this->$key = $value;
					}else{
						Throw new \Exception();
					}
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