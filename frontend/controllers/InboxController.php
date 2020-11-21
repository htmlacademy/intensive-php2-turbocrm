<?php


namespace frontend\controllers;


use common\services\GmailClient;
use common\services\GoogleAuthClientFactory;
use common\services\MailClient;
use frontend\models\EmailSearchForm;

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

        $searchForm = new EmailSearchForm();
        $searchForm->load(\Yii::$app->request->get());
        $searchForm->validate();

        $messages = $this->mailClient->getMessages(10, $searchForm->q);

        if ($msgid) {
            $selected_message = $this->mailClient->getMessageById($msgid);
        }

        return $this->render('mail',
            [
                'unread_count' => $this->mailClient->getUnreadCount(),
                'messages' => $messages,
                'selected_message' => $selected_message,
                'msgid' => $msgid,
                'model' => $searchForm
            ]);
    }

}
