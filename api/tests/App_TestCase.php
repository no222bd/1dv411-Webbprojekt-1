<?php

class App_TestCase extends \PHPUnit_Framework_TestCase{
	/* http://www.webtipblog.com/unit-testing-private-methods-and-properties-with-phpunit/ */
	public function getPrivateProperty( $className, $propertyName ) {
		$reflector = new ReflectionClass( $className );
		$property = $reflector->getProperty( $propertyName );
		$property->setAccessible( true );

		return $property;
	}

	/* http://www.webtipblog.com/unit-testing-private-methods-and-properties-with-phpunit/ */
	public function getPrivateMethod( $className, $methodName ) {
		$reflector = new ReflectionClass( $className );
		$method = $reflector->getMethod( $methodName );
		$method->setAccessible( true );

		return $method;
	}
}