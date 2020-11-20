<?php


namespace frontend\controllers;


use common\services\GmailClient;
use common\services\GoogleAuthClientFactory;

class InboxController extends SecuredController
{

    public function actionEmail()
    {
        $authCLient = GoogleAuthClientFactory::getInstance();

        if (!$authCLient->prepareClient()) {
            $this->redirect($authCLient->getAuthUrl());
        }

        $gmailClient = new GmailClient($authCLient);
        $messages = $gmailClient->getMessages();
    }

}
