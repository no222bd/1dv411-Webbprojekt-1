<?php
namespace app\controller;
use Silex\Application;
use \app\model;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class CubeController
 * @package app\controller
 */
class CubeController{

	/**
	 * @var model\Buildning
	 */
	private $building;

	/**
	 *
	 */
	public function __construct(){
		$this->building = new \app\model\Buildning();
	}

	/**
	 * @return Response
	 */
	public function frontend(){
		return new Response(@file_get_contents('front-end/index.html'));
	}

	/**
	 * @param Application $app
	 * @return \Symfony\Component\HttpFoundation\JsonResponse
	 */
	public function index(Application $app) {
		$data = $this->building->getAll();
		if(!is_null($data)){
			return $app->json(array('data' => $data), 200);
		}
		return $app->json(array('message' => ''), 200);
	}

	/**
	 * @param $id
	 * @param Application $app
	 * @return \Symfony\Component\HttpFoundation\JsonResponse
	 */
	public function show($id, Application $app){
		$data = $this->building->loadJson($id);
		if($data) {
			return $app->json(array('data' => $data), 200);
		}
		return $app->json(array('message' => ''), 200);
	}

	/**
	 * @param Request $request
	 * @param Application $app
	 * @return \Symfony\Component\HttpFoundation\JsonResponse
	 */
	public function create(Request $request, Application $app){
		$this->building->setName($request->get('name'));
		$this->building->setModel($request->get('model'));
		if($this->building->haveErrors()){
			return $app->json(array('message' => 'Your model could not be created.', 'errors' => $this->building->getErrors()), 200);
		}
		if($this->building->save()) {
			return $app->json(array('message' => 'Your model have been created.'), 201);
		}else{
			return $app->json(array('message' => 'Your model could not be created.'), 200);
		}
	}

}