<?php


namespace frontend\controllers;


use common\services\GoogleAuthClientFactory;
use yii\web\Controller;

class ThirdPartyController extends Controller
{

    public function actionAuth($code)
    {
        $authCLient = GoogleAuthClientFactory::getInstance();

        $accessToken = $authCLient->fetchAccessTokenByCode($code);

        if ($accessToken) {
            $authCLient->storeToken($accessToken);

            $this->redirect(['inbox/mail']);
        }

    }

}
