<?php


namespace frontend\controllers;


use common\services\GmailClient;
use common\services\GoogleAuthClientFactory;
use common\services\MailClient;

class InboxController extends SecuredController
{
    /**
     * @var MailClient
     */
    protected $mailClient;

    public function init()
    {
        parent::init();

        $authCLient = GoogleAuthClientFactory::getInstance();

        if (!$authCLient->prepareClient()) {
            $this->redirect($authCLient->getAuthUrl());
        }

        $this->mailClient = new GmailClient($authCLient);
    }


    public function actionEmail($msgid = null)
    {
        $selected_message = null;
        $messages = $this->mailClient->getMessages(5);

        if ($msgid) {
            $selected_message = $this->mailClient->getMessageById($msgid);
        }

        return $this->render('mail', ['messages' => $messages, 'selected_message' => $selected_message, 'msgid' => $msgid]);
    }

}
