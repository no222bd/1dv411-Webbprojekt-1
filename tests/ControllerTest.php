<?php
use Silex\WebTestCase;
use Silex\Application;

class ControllerTest extends WebTestCase {

	private $subfolder;

	protected function tearDown(){
		if(file_exists('./api/db.json')) {
			unlink('./api/db.json');
		}
		rename("./api/test_ db.json", "./api/db.json");
	}

	public function createApplication() {
		rename("./api/db.json", "./api/test_ db.json");
		copy("./api/test_ db.json", "./api/db.json");
		$app = new Application();
		$app['session.test'] = true;
		new \app\controller\MasterController($app);
		$this->subfolder = 'webbprojekt1';
		return $this->app = $app;
	}

	public function testIndex() {
		$client = $this->createClient();
		$client->request('GET', $this->subfolder.'/api');
		$this->assertEquals(200, $client->getResponse()->getStatusCode());

		unlink('./api/db.json');
		$client = $this->createClient();
		$client->request('GET', $this->subfolder.'/api');
		$this->assertEquals(204, $client->getResponse()->getStatusCode());
	}

	public function testShow(){
		$client = $this->createClient();
		$client->request('GET', $this->subfolder.'/api/david');
		$this->assertEquals(200, $client->getResponse()->getStatusCode());

		$client = $this->createClient();
		$client->request('GET', $this->subfolder.'/api/finnsej');
		$this->assertEquals(400, $client->getResponse()->getStatusCode());
	}

	public function testCreate(){
		$client = $this->createClient();
		$client->request('POST', $this->subfolder.'/api');
		$this->assertEquals(400, $client->getResponse()->getStatusCode());

		$client = $this->createClient();
		$client->request('POST', $this->subfolder.'/api', array('name' => 'phpunit', 'model' => '{"step":25,"baseSize":20,"cubes":[{"color":"e60012","x":-325,"y":25,"z":-275},{"color":"e60012","x":-275,"y":25,"z":-275},{"color":"e60012","x":-225,"y":25,"z":-275},{"color":"e60012","x":-75,"y":25,"z":-275},{"color":"e60012","x":-125,"y":25,"z":-275},{"color":"000000","x":25,"y":25,"z":-175},{"color":"e60012","x":-25,"y":25,"z":-275},{"color":"e60012","x":25,"y":25,"z":-275},{"color":"e60012","x":75,"y":25,"z":-275},{"color":"e60012","x":175,"y":25,"z":-275},{"color":"e60012","x":225,"y":25,"z":-275},{"color":"e60012","x":125,"y":25,"z":-275},{"color":"e60012","x":275,"y":25,"z":-275},{"color":"e60012","x":125,"y":25,"z":-325},{"color":"e60012","x":75,"y":25,"z":-325},{"color":"e60012","x":25,"y":25,"z":-325},{"color":"e60012","x":-25,"y":25,"z":-325},{"color":"e60012","x":-75,"y":25,"z":-325},{"color":"e60012","x":-175,"y":25,"z":-275},{"color":"e60012","x":-125,"y":25,"z":-325},{"color":"e60012","x":-175,"y":25,"z":-325},{"color":"e60012","x":-275,"y":25,"z":-325},{"color":"e60012","x":-225,"y":25,"z":-325},{"color":"e60012","x":275,"y":25,"z":-225},{"color":"e60012","x":325,"y":25,"z":-225},{"color":"e60012","x":375,"y":25,"z":-225},{"color":"e60012","x":375,"y":25,"z":-175},{"color":"e60012","x":375,"y":25,"z":-125},{"color":"e60012","x":325,"y":25,"z":-175},{"color":"009944","x":-325,"y":25,"z":-225},{"color":"009944","x":-275,"y":25,"z":-225},{"color":"009944","x":-225,"y":25,"z":-225},{"color":"009944","x":-275,"y":25,"z":-175},{"color":"009944","x":-275,"y":25,"z":-125},{"color":"009944","x":-225,"y":25,"z":-125},{"color":"009944","x":-375,"y":25,"z":-175},{"color":"009944","x":-375,"y":25,"z":-125},{"color":"009944","x":-375,"y":25,"z":-75},{"color":"009944","x":-325,"y":25,"z":-75},{"color":"000000","x":25,"y":25,"z":-225},{"color":"000000","x":75,"y":25,"z":-125},{"color":"000000","x":25,"y":25,"z":-75},{"color":"000000","x":75,"y":25,"z":-75},{"color":"000000","x":125,"y":25,"z":-75},{"color":"000000","x":175,"y":25,"z":-75},{"color":"000000","x":225,"y":25,"z":-75},{"color":"000000","x":275,"y":25,"z":-75},{"color":"fde3c5","x":-325,"y":25,"z":-175},{"color":"fde3c5","x":-325,"y":25,"z":-125},{"color":"fde3c5","x":-175,"y":25,"z":-175},{"color":"fde3c5","x":-75,"y":25,"z":-225},{"color":"fde3c5","x":-25,"y":25,"z":-225},{"color":"fde3c5","x":-25,"y":25,"z":-175},{"color":"fde3c5","x":-125,"y":25,"z":-175},{"color":"fde3c5","x":-125,"y":25,"z":-225},{"color":"fde3c5","x":-175,"y":25,"z":-225},{"color":"fde3c5","x":-225,"y":25,"z":-175},{"color":"fde3c5","x":-125,"y":25,"z":-125},{"color":"fde3c5","x":-175,"y":25,"z":-125},{"color":"fde3c5","x":-75,"y":25,"z":-125},{"color":"fde3c5","x":25,"y":25,"z":-125},{"color":"fde3c5","x":-75,"y":25,"z":-175},{"color":"fde3c5","x":-25,"y":25,"z":-125},{"color":"fde3c5","x":-275,"y":25,"z":-75},{"color":"fde3c5","x":-225,"y":25,"z":-75},{"color":"fde3c5","x":-175,"y":25,"z":-75},{"color":"fde3c5","x":-125,"y":25,"z":-75},{"color":"fde3c5","x":-75,"y":25,"z":-75},{"color":"fde3c5","x":-25,"y":25,"z":-75},{"color":"fde3c5","x":75,"y":25,"z":-225},{"color":"fde3c5","x":125,"y":25,"z":-225},{"color":"fde3c5","x":175,"y":25,"z":-225},{"color":"fde3c5","x":225,"y":25,"z":-225},{"color":"fde3c5","x":325,"y":25,"z":-125},{"color":"fde3c5","x":275,"y":25,"z":-125},{"color":"fde3c5","x":275,"y":25,"z":-175},{"color":"fde3c5","x":175,"y":25,"z":-125},{"color":"fde3c5","x":225,"y":25,"z":-125},{"color":"fde3c5","x":225,"y":25,"z":-175},{"color":"fde3c5","x":175,"y":25,"z":-175},{"color":"fde3c5","x":125,"y":25,"z":-175},{"color":"fde3c5","x":125,"y":25,"z":-125},{"color":"fde3c5","x":75,"y":25,"z":-175},{"color":"fde3c5","x":375,"y":25,"z":-275},{"color":"fde3c5","x":325,"y":25,"z":-275},{"color":"fde3c5","x":275,"y":25,"z":-325},{"color":"fde3c5","x":325,"y":25,"z":-325},{"color":"fde3c5","x":375,"y":25,"z":-325},{"color":"fde3c5","x":-275,"y":25,"z":-25},{"color":"fde3c5","x":-225,"y":25,"z":-25},{"color":"fde3c5","x":225,"y":25,"z":-25},{"color":"fde3c5","x":125,"y":25,"z":-25},{"color":"fde3c5","x":75,"y":25,"z":-25},{"color":"fde3c5","x":-25,"y":25,"z":-25},{"color":"fde3c5","x":-125,"y":25,"z":-25},{"color":"fde3c5","x":-175,"y":25,"z":-25},{"color":"fde3c5","x":-75,"y":25,"z":-25},{"color":"fde3c5","x":25,"y":25,"z":-25},{"color":"fde3c5","x":175,"y":25,"z":-25},{"color":"e60012","x":325,"y":25,"z":-75},{"color":"e60012","x":325,"y":25,"z":-25},{"color":"e60012","x":275,"y":25,"z":-25},{"color":"e60012","x":225,"y":25,"z":25},{"color":"e60012","x":275,"y":25,"z":25},{"color":"e60012","x":75,"y":25,"z":25},{"color":"e60012","x":25,"y":25,"z":25},{"color":"e60012","x":-25,"y":25,"z":25},{"color":"e60012","x":-75,"y":25,"z":25},{"color":"e60012","x":-125,"y":25,"z":25},{"color":"e60012","x":-225,"y":25,"z":25},{"color":"e60012","x":-275,"y":25,"z":25},{"color":"e60012","x":-325,"y":25,"z":25},{"color":"e60012","x":-375,"y":25,"z":25},{"color":"e60012","x":-425,"y":25,"z":25},{"color":"e60012","x":-425,"y":25,"z":75},{"color":"e60012","x":-425,"y":25,"z":125},{"color":"e60012","x":-375,"y":25,"z":175},{"color":"e60012","x":-325,"y":25,"z":175},{"color":"e60012","x":-225,"y":25,"z":225},{"color":"e60012","x":-275,"y":25,"z":175},{"color":"e60012","x":-175,"y":25,"z":175},{"color":"0068b7","x":-175,"y":25,"z":25},{"color":"0068b7","x":-125,"y":25,"z":75},{"color":"0068b7","x":-125,"y":25,"z":125},{"color":"0068b7","x":-125,"y":25,"z":175},{"color":"0068b7","x":-25,"y":25,"z":175},{"color":"0068b7","x":-75,"y":25,"z":175},{"color":"0068b7","x":25,"y":25,"z":175},{"color":"0068b7","x":75,"y":25,"z":175},{"color":"0068b7","x":175,"y":25,"z":175},{"color":"0068b7","x":125,"y":25,"z":175},{"color":"0068b7","x":225,"y":25,"z":175},{"color":"0068b7","x":125,"y":25,"z":25},{"color":"0068b7","x":175,"y":25,"z":25},{"color":"0068b7","x":225,"y":25,"z":75},{"color":"fff100","x":225,"y":25,"z":125},{"color":"fff100","x":-75,"y":25,"z":225},{"color":"0068b7","x":-125,"y":25,"z":225},{"color":"0068b7","x":-125,"y":25,"z":275},{"color":"0068b7","x":-175,"y":25,"z":275},{"color":"0068b7","x":-225,"y":25,"z":275},{"color":"0068b7","x":-225,"y":25,"z":325},{"color":"0068b7","x":-175,"y":25,"z":325},{"color":"0068b7","x":-125,"y":25,"z":325},{"color":"0068b7","x":-75,"y":25,"z":325},{"color":"0068b7","x":-25,"y":25,"z":325},{"color":"0068b7","x":-25,"y":25,"z":275},{"color":"0068b7","x":25,"y":25,"z":275},{"color":"0068b7","x":125,"y":25,"z":275},{"color":"0068b7","x":75,"y":25,"z":275},{"color":"0068b7","x":225,"y":25,"z":275},{"color":"0068b7","x":175,"y":25,"z":275},{"color":"0068b7","x":375,"y":25,"z":275},{"color":"0068b7","x":375,"y":25,"z":225},{"color":"0068b7","x":275,"y":25,"z":125},{"color":"0068b7","x":325,"y":25,"z":125},{"color":"0068b7","x":375,"y":25,"z":125},{"color":"0068b7","x":375,"y":25,"z":175},{"color":"0068b7","x":325,"y":25,"z":175},{"color":"0068b7","x":325,"y":25,"z":275},{"color":"0068b7","x":275,"y":25,"z":275},{"color":"0068b7","x":325,"y":25,"z":225},{"color":"0068b7","x":275,"y":25,"z":175},{"color":"0068b7","x":275,"y":25,"z":225},{"color":"0068b7","x":225,"y":25,"z":225},{"color":"0068b7","x":125,"y":25,"z":225},{"color":"0068b7","x":175,"y":25,"z":225},{"color":"0068b7","x":-25,"y":25,"z":225},{"color":"0068b7","x":75,"y":25,"z":225},{"color":"0068b7","x":25,"y":25,"z":225},{"color":"0068b7","x":-75,"y":25,"z":275},{"color":"0068b7","x":-275,"y":25,"z":325},{"color":"0068b7","x":-275,"y":25,"z":275},{"color":"e60012","x":-375,"y":25,"z":125},{"color":"e60012","x":-225,"y":25,"z":175},{"color":"e60012","x":-175,"y":25,"z":125},{"color":"e60012","x":-175,"y":25,"z":75},{"color":"e60012","x":-225,"y":25,"z":75},{"color":"e60012","x":-275,"y":25,"z":75},{"color":"e60012","x":-325,"y":25,"z":75},{"color":"e60012","x":-375,"y":25,"z":75},{"color":"e60012","x":-325,"y":25,"z":125},{"color":"e60012","x":-275,"y":25,"z":125},{"color":"e60012","x":-225,"y":25,"z":125},{"color":"e60012","x":-175,"y":25,"z":225},{"color":"e60012","x":-75,"y":25,"z":75},{"color":"e60012","x":-75,"y":25,"z":125},{"color":"e60012","x":-25,"y":25,"z":125},{"color":"e60012","x":25,"y":25,"z":125},{"color":"e60012","x":75,"y":25,"z":125},{"color":"e60012","x":175,"y":25,"z":125},{"color":"e60012","x":175,"y":25,"z":75},{"color":"e60012","x":125,"y":25,"z":75},{"color":"e60012","x":125,"y":25,"z":125},{"color":"e60012","x":75,"y":25,"z":75},{"color":"e60012","x":25,"y":25,"z":75},{"color":"e60012","x":-25,"y":25,"z":75},{"color":"fde3c5","x":-475,"y":25,"z":75},{"color":"fde3c5","x":-475,"y":25,"z":125},{"color":"fde3c5","x":-475,"y":25,"z":225},{"color":"fde3c5","x":-475,"y":25,"z":175},{"color":"fde3c5","x":-425,"y":25,"z":175},{"color":"7f3e09","x":425,"y":25,"z":275},{"color":"7f3e09","x":475,"y":25,"z":275},{"color":"7f3e09","x":475,"y":25,"z":225},{"color":"7f3e09","x":475,"y":25,"z":125},{"color":"7f3e09","x":475,"y":25,"z":75},{"color":"7f3e09","x":475,"y":25,"z":25},{"color":"7f3e09","x":425,"y":25,"z":75},{"color":"7f3e09","x":425,"y":25,"z":125},{"color":"7f3e09","x":425,"y":25,"z":175},{"color":"7f3e09","x":425,"y":25,"z":225},{"color":"7f3e09","x":475,"y":25,"z":175},{"color":"7f3e09","x":-375,"y":25,"z":225},{"color":"7f3e09","x":-325,"y":25,"z":275},{"color":"7f3e09","x":-325,"y":25,"z":225},{"color":"7f3e09","x":-375,"y":25,"z":275},{"color":"7f3e09","x":-425,"y":25,"z":325},{"color":"7f3e09","x":-375,"y":25,"z":325},{"color":"7f3e09","x":-325,"y":25,"z":325},{"color":"7f3e09","x":-375,"y":25,"z":375},{"color":"7f3e09","x":-425,"y":25,"z":375},{"color":"0068b7","x":-275,"y":25,"z":225},{"color":"7f3e09","x":-275,"y":75,"z":275}]}'));
		$this->assertEquals(201, $client->getResponse()->getStatusCode());
	}

	public function testCreateFilters(){
		unset($this->app['session.test']);
		$client = $this->createClient();
		$client->request('GET', $this->subfolder.'/api/david');
		$this->assertEquals(401, $client->getResponse()->getStatusCode());
	}

	public function testMasterControllerConstruct(){
		$this->assertTrue(count(new \app\controller\MasterController(new Application())) > 0);
	}
}