<?php


namespace app\services;


interface MailClient
{

    public function __construct(AuthClient $authClient);

    /**
     * @param int $max_count
     * @param $search_query
     * @return containers\MailMessage[]
     */
    public function getMessages($max_count = 10, $search_query = null);

    /**
     * @param $msgid
     * @return containers\MailMessage;
     */
    public function getMessageById($msgid);

    public function getUnreadCount();
}
