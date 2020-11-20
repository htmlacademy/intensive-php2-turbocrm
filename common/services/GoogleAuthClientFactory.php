<?php


namespace common\services;
use Yii;

class GoogleAuthClientFactory
{

    /**
     * @return AuthClient
     */
    public static function getInstance()
    {
        $creds = Yii::getAlias('@common/data/credentials.json');
        $token = Yii::getAlias('@common/data/token.json');

        $client = new GoogleAuthClient($creds, $token, \Google_Service_Gmail::GMAIL_READONLY);

        return $client;
    }

}
