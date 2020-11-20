<?php


namespace common\services\containers;


use Google_Service_Gmail_Message;
use PhpMimeMailParser\Parser;
use ZBateson\MailMimeParser\Message;

class GmailMessage implements MailMessage
{

    protected $body;
    protected $subject;
    protected $date;
    protected $sender;
    protected $id;
    protected $unread = false;

    /**
     * @var Parser
     */
    protected $parser;

    /**
     * GmailMessage constructor.
     * @param Google_Service_Gmail_Message $rawMessage
     * @param bool $only_headers
     */
    public function __construct(Google_Service_Gmail_Message $rawMessage, $only_headers = true)
    {
        if (!$only_headers) {
            $this->parser = new Parser();
        }

        $this->prepare($rawMessage, $only_headers);

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

    public function getSender()
    {
        return $this->sender;
    }

    public function getDate()
    {
        return $this->date;
    }

    public function getIsUnread()
    {
        return $this->unread;
    }

    protected function prepare(Google_Service_Gmail_Message $rawMessage, $only_headers = true)
    {
        $payload = $rawMessage->getPayload();
        $headers = $payload ? $payload->getHeaders() : [];

        $this->id = $rawMessage->getId();

        if (!$only_headers) {
            $this->body = $rawMessage->getSnippet();
        }

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

    protected function loadMetadata()
    {

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
