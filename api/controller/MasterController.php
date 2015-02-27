<?php
namespace api\controller;
use \Silex\Application;

/**
 * Class MasterController
 * @package app\controller
 */
class MasterController{

	/**
	 * @var Application
	 */
	private $app;

	/**
	 *
	 */
	public function __construct($app){
		$this->app = $app;
		$this->route();
		$this->config();
		if(!isset($this->app['session.test'])) {
			$this->app->run();
		}
	}

	private function route(){
		$this->app->get('/', '\api\controller\CubeController::index');
		$this->app->get('/{id}', '\api\controller\CubeController::show');
		$this->app->post('/create', '\api\controller\CubeController::create');
	}

	/**
	 *
	 */
	private function config(){
		$this->app['debug'] = true;
	}
}