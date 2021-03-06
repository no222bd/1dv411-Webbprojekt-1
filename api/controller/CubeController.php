<?php
namespace api\controller;

use api\model;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class CubeController
 * @package app\controller
 */
class CubeController {

	/**
	 * @var model\Building
	 */
	private $building;

	/**
	 *
	 */
	public function __construct() {
		$this->building = new \api\model\Building();
	}

	/**
	 * @param Application $app
	 * @return \Symfony\Component\HttpFoundation\JsonResponse
	 */
	public function index(Application $app) {
		$data = $this->building->getAll();
		if(!empty($data)) {
			return $app->json(array('data' => $data), 200);
		}
		return $app->json(array('message' => 'There are no buildning saved for the moment.'), 204);
	}

	/**
	 * @param $id
	 * @param Application $app
	 * @return \Symfony\Component\HttpFoundation\JsonResponse
	 */
	public function show($id, Application $app) {
		$data = $this->building->get(strtolower($id));
		if($data) {
			return $app->json(array('data' => $data), 200);
		}
		return $app->json(array('message' => 'We could not find that building.'), 400);
	}

	/**
	 * @param Request $request
	 * @param Application $app
	 * @return \Symfony\Component\HttpFoundation\JsonResponse
	 */
	public function create(Request $request, Application $app) {
		$this->building->setName(strtolower($request->get('name')));
		$this->building->setModel($request->get('model'));
		if($this->building->haveErrors()) {
			return $app->json(array('message' => 'Your model could not be created.', 'errors' => $this->building->getErrors()), 400);
		}
		if($this->building->save()) {
			return $app->json(array('message' => 'Your model have been created.', 'data' => $this->building->getCurretBuilding()), 201);
		} else {
			return $app->json(array('message' => 'Your model could not be created.'), 503);
		}
	}

}