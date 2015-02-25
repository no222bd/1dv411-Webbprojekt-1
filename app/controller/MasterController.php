<?php
namespace app\controller;
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
		\Dotenv::load('./');
		$this->route();
		$this->config();
		$this->createFilters();
		if(!isset($this->app['session.test'])) {
			$this->app->run();
		}
	}

	private function route(){
		$subfolderOnLocalhost = $_ENV['BASE_DIR'];
		$this->app->get($subfolderOnLocalhost.'/api', '\app\controller\CubeController::index');
		$this->app->get($subfolderOnLocalhost.'/api/{id}', '\app\controller\CubeController::show');
		$this->app->post($subfolderOnLocalhost.'/api', '\app\controller\CubeController::create');
	}

	/**
	 *
	 */
	private function config(){
		$this->app['debug'] = true;
	}

	/**
	 *
	 */
	private function createFilters(){
		$this->app->before(function() {
			// Source: http://davidwalsh.name/detect-ajax
			if(!(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') && !isset($this->app['session.test'])) {
				return $this->app->json(array('message' => 'Please send a ajax request to fetch content'), 401);
			}
		});
	}
}