<?php
namespace app\model;

Class Cube{
	private $color;
	private $x;
	private $y;
	private $z;

	private function validatePosition(){

	}

	public function set($cube){
		$this->x = $cube['x'];
		$this->y = $cube['y'];
		$this->z = $cube['z'];
		$this->color = $cube['color'];
	}

	public function get(){
		return array("color" => $this->color, "x" => $this->x, "y" => $this->y, "z" => $this->z);
	}
}