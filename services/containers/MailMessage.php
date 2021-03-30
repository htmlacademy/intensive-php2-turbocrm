<?php

namespace app\services\containers;

interface MailMessage
{
    public function getId();

    public function getSubject();

    public function getBody();

    public function getSenderName();

    public function getSenderAddress();

    public function getDate();

    public function getIsUnread();

}
