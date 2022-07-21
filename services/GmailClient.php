<?php


namespace app\services;


use app\services\containers\GmailMessage;
use Google_Service_Gmail;
use Google_Service_Gmail_Message;

class GmailClient implements MailClient
{

    /**
     * @var AuthClient
     */
    protected $authClient;

    protected $serviceGmail;

    protected $user = 'me';

    public function __construct(AuthClient $authClient)
    {
        $this->authClient = $authClient;
        $this->serviceGmail = new Google_Service_Gmail($authClient->getVendorClient());
    }

    /**
     * @inheritDoc
     */
    public function getMessages($max_count = 10, $search_query = null)
    {
        $result = [];
        $params = ['maxResults' => $max_count];

        if ($search_query) {
            $params['q'] = $search_query;
        }

        $response = $this->serviceGmail->users_messages->listUsersMessages($this->user, $params);

        /**
         * @var $messages Google_Service_Gmail_Message[]
         */
        $messages = $response->getMessages();

        foreach ($messages as $message) {
            $msg = $this->serviceGmail->users_messages->get($this->user, $message->getId(), ['format' => 'METADATA']);

            $result[] = new GmailMessage($msg);
        }

        return $result;
    }

    public function getUnreadCount()
    {
        $response = $this->serviceGmail->users_messages->listUsersMessages($this->user, ['labelIds' => ['UNREAD']]);

        return $response->count();
    }

    public function getMessageById($msgid)
    {
        $rawMessage = $this->serviceGmail->users_messages->get($this->user, $msgid, ['format' => 'FULL']);
        $message = new GmailMessage($rawMessage);

        return $message;
    }


}
