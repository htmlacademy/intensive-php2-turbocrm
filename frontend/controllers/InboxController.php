<?php


namespace frontend\controllers;

use common\services\containers\MailMessage;
use frontend\models\Company;
use frontend\models\Deal;
use Yii;
use common\services\GmailClient;
use common\services\GoogleAuthClientFactory;
use common\services\MailClient;
use frontend\models\Contact;
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
            header("Location: " . $authCLient->getAuthUrl());
            exit;
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

    public function actionCreateContact($msgid = null)
    {
        $message = $this->mailClient->getMessageById($msgid);
        $this->addContact($message);

        Yii::$app->getSession()->setFlash('persons_create');

        return $this->redirect(['contacts/index']);
    }

    public function actionCreateDeal($msgid = null)
    {
        $message = $this->mailClient->getMessageById($msgid);
        $contact = $this->addContact($message);

        $deal = new Deal();
        $deal->company_id = Company::find()->one()->id;
        $deal->status_id = 1;
        $deal->user_id = Yii::$app->user->getId();
        $deal->contact_id = $contact->id;
        $deal->name = $message->getSubject();
        $deal->description = $message->getBody();

        $deal->save();

        return $this->redirect(['deals/view', 'id' => $deal->id]);
    }

    /**
     * @param MailMessage $message
     * @return Contact
     */
    protected function addContact(MailMessage $message)
    {
        $contact = new Contact();
        $contact->name = $message->getSenderName();
        $contact->email = $message->getSenderAddress();
        $contact->save();

        return $contact;
    }

}
