<?php
namespace app\controller;
use Silex\Application;
use \app\model;
use Symfony\Component\HttpFoundation\Request;

class CubeController{

	private $building;

	public function __construct(){
		$this->building = new \app\model\Buildning();
	}

	public function index(Application $app){
		return $app->json(array('message' => ''), 200);
	}

	public function show($id, Application $app){
		return $app->json(array('message' => $id), 200);
	}

	public function create(Request $request, Application $app){
		$this->building->setName($request->get('name'));
		$this->building->setModel($request->get('model'));
		if($this->building->haveErrors()){
			return $app->json(array('message' => 'Your model could not be created.', 'errors' => $this->building->getErrors()), 200);
		}
		return $app->json(array('message' => 'Your model have been created.'), 201);
	}

}