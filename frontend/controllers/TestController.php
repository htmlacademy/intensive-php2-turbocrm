<?php

namespace frontend\controllers;

use GuzzleHttp\Exception\RequestException;
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

        try {
            $response = $client->request('GET', 'check', [
                'query' => ['email' => $email, 'access_key' => $api_key]
            ]);

            $content = $response->getBody()->getContents();
            $response_data = json_decode($content, true);

            $result = false;

            if (is_array($response_data)) {
                $result = !empty($response_data['mx_found']) && !empty($response_data['smtp_check']);
            }
        } catch (RequestException $e) {
            $result = true;
        }

        var_dump("Результат проверки $email", $result);
    }
}
