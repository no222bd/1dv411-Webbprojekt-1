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
		if(is_null($base) && is_null($step)){
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
		$inValid = true;
		switch($type){
			case 'z':
				break;
			case 'x':
				break;
			case 'y':
				break;
			default:
				Throw new \Exception();
				break;
		}
		if($inValid){
			return 0;
		}
		return $position;
	}

	/**
	 * @param $cube
	 */
	public function set($cube){
		$this->x = $cube['x'];
		$this->y = $cube['y'];
		$this->z = $cube['z'];
		$this->color = $cube['color'];
	}

	/**
	 * @return array
	 */
	public function get(){
		return array("color" => $this->color, "x" => $this->x, "y" => $this->y, "z" => $this->z);
	}
}