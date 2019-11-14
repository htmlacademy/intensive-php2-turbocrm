<?php

namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use GuzzleHttp\Client;

class TestController extends Controller
{
    public function actionIndex()
    {
        $email = Yii::$app->request->get('email', 'john@smith.com');
        $api_key = Yii::$app->params['apiKey'];

        $client = new Client([
            'base_uri' => 'https://apilayer.net/api/',
        ]);

        $response = $client->request('GET', 'check', [
            'query' => ['email' => $email, 'access_key' => $api_key]
        ]);
    }
}
