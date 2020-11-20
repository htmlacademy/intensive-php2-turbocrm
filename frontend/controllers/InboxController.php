<?php


namespace frontend\controllers;


use common\services\GoogleAuthClientFactory;

class InboxController extends SecuredController
{

    public function actionEmail()
    {
        $authCLient = GoogleAuthClientFactory::getInstance();

        if (!$authCLient->prepareClient()) {
            $auth_url = $authCLient->getAuthUrl();

            $this->redirect($auth_url);
        }
    }

}
