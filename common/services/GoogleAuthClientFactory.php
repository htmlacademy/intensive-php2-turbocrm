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
        $creds = Yii::getAlias('@common/data/credentials.json');
        $token = Yii::getAlias('@common/data/token.json');

        $redirectUrl = Url::to('third-party/auth', true);

        $client = new GoogleAuthClient($creds, $token, \Google_Service_Gmail::GMAIL_READONLY, $redirectUrl);

        return $client;
    }

}
