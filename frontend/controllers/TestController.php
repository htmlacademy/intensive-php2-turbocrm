<?php

namespace frontend\controllers;

use frontend\validators\RemoteEmailValidator;
use GuzzleHttp\Exception\BadResponseException;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ServerException;
use GuzzleHttp\Psr7\Request;
use Yii;
use yii\helpers\ArrayHelper;
use yii\web\Controller;
use GuzzleHttp\Client;

class TestController extends Controller
{
    public function actionIndex()
    {
        $email = Yii::$app->request->get('email', 'john@smith.com');

        $validator = new RemoteEmailValidator();
        $result = $validator->validate($email);

        var_dump("Результат проверки $email", $result);
    }
}
