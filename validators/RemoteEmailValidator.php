<?php

namespace app\validators;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\BadResponseException;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ServerException;
use GuzzleHttp\Psr7\Request;
use Yii;
use yii\helpers\ArrayHelper;
use yii\validators\Validator;

class RemoteEmailValidator extends Validator
{
    public $message = 'Указанный email не существует';

    protected function validateValue($value)
    {
        $result = false;

        $client = new Client([
            'base_uri' => 'https://apilayer.net/api/',
        ]);

        try {
            $request = new Request('GET', 'check');
            $response = $client->send($request, [
                'query' => ['email' => $value, 'access_key' => Yii::$app->params['apiKey']]
            ]);

            if ($response->getStatusCode() !== 200) {
                throw new BadResponseException("Response error: " . $response->getReasonPhrase(), $request);
            }

            $content = $response->getBody()->getContents();
            $response_data = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new ServerException("Invalid json format", $request);
            }

            if ($error = ArrayHelper::getValue($response_data, 'error.info')) {
                throw new BadResponseException("API error: " . $error, $request);
            }

            if (is_array($response_data)) {
                $result = !empty($response_data['mx_found']) && !empty($response_data['smtp_check']);
            }
        } catch (RequestException $e) {
            $result = true;
        }

        if (!$result) {
            return [$this->message, []];
        }

        return null;
    }

}
