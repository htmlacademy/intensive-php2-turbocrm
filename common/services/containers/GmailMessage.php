<?php


namespace common\services\containers;


class GmailMessage implements MailMessage
{

    protected $body;
    protected $subject;
    protected $date;
    protected $sender;
    protected $snippet;

    /**
     * GmailMessage constructor.
     * @param \Google_Service_Gmail_Message $rawMessage
     */
    public function __construct(\Google_Service_Gmail_Message $rawMessage)
    {
        $this->prepare($rawMessage);
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

    public function hasAttach()
    {
        return false;
    }

    public function getDate()
    {
        return $this->date;
    }

    public function isMarked()
    {
        return false;
    }

    public function getSnippet()
    {
        // TODO: Implement getSnippet() method.
    }

    protected function prepare(\Google_Service_Gmail_Message $rawMessage)
    {
        $this->snippet = $rawMessage->getSnippet();
        $payload = $rawMessage->getPayload();
        $parts = $payload->getParts();
        $part = count($parts) > 1 ? 1 : 0;

        $this->body = base64_decode($parts[$part]->getBody()->getData());
        $headers = $payload->getHeaders();

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
    }
}
