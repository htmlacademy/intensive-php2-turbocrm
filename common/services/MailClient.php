<?php


namespace common\services;


interface MailClient
{

    public function __construct(AuthClient $authClient);

    /**
     * @param int $max_count
     * @return containers\MailMessage[]
     */
    public function getMessages($max_count = 10);


}
