<?php


namespace app\services\containers;


use Google_Service_Gmail_Message;

class GmailMessage implements MailMessage
{
    protected $body;
    protected $subject;
    protected $date;
    protected $sender;
    protected $id;
    protected $unread = false;

    protected $regexp = '/^([\w\s]+) \<([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)\>$/m';

    /**
     * GmailMessage constructor.
     * @param Google_Service_Gmail_Message $rawMessage
     */
    public function __construct(Google_Service_Gmail_Message $rawMessage)
    {
        $this->prepare($rawMessage);
    }

    public function getId()
    {
        return $this->id;
    }

    public function getSubject()
    {
        return $this->subject;
    }

    public function getBody()
    {
        return $this->body;
    }

    public function getSenderName()
    {
        preg_match($this->regexp, $this->sender, $matches);

        return $matches[1] ?? 'Без имени';
    }

    public function getSenderAddress()
    {
        preg_match($this->regexp, $this->sender, $matches);

        return $matches[2] ?? $this->sender;
    }

    public function getDate()
    {
        return $this->date;
    }

    public function getIsUnread()
    {
        return $this->unread;
    }

    protected function prepare(Google_Service_Gmail_Message $rawMessage)
    {
        $payload = $rawMessage->getPayload();
        $headers = $payload ? $payload->getHeaders() : [];

        $this->id = $rawMessage->getId();
        $this->body = $rawMessage->getSnippet();

        foreach ($headers as $header) {
            $name = $header->getName();
            $value = $header->getValue();

            switch ($name) {
                case 'Date':
                    $this->date = $value;
                    break;
                case 'Subject':
                    $this->subject = $value;
                    break;
                case 'From':
                    $this->sender = $value;
                    break;
            }
        }

        $this->id = $rawMessage->getId();
        $this->unread = $this->isUnread($rawMessage);
    }

    protected function isUnread(Google_Service_Gmail_Message $rawMessage)
    {
        $result = false;

        foreach ($rawMessage->getLabelIds() as $label) {
            if ($label == 'UNREAD') {
                $result = true;
                break;
            }
        }

        return $result;
    }
}
