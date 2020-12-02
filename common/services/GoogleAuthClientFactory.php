<?php


namespace common\services;
use Yii;
use yii\helpers\Url;

class GoogleAuthClientFactory
{

    /**
     * @return AuthClient
     */
    public static function getInstance()
    {
        $token = 'token' . Yii::$app->user->getId() . '.json';

        $creds = Yii::getAlias('@common/data/credentials.json');
        $token = Yii::getAlias('@common/data/' . $token);

        $redirectUrl = Url::to('third-party/auth', true);

        $client = new GoogleAuthClient($creds, $token, \Google_Service_Gmail::GMAIL_READONLY, $redirectUrl);

        return $client;
    }

}
