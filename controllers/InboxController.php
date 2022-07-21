<?php


namespace app\controllers;

use app\services\containers\MailMessage;
use app\models\Company;
use app\models\Deal;
use Yii;
use app\services\GmailClient;
use app\services\GoogleAuthClientFactory;
use app\services\MailClient;
use app\models\Contact;
use app\models\EmailSearchForm;

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
