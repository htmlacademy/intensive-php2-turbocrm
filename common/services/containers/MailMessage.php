<?php

namespace common\services\containers;

interface MailMessage
{
    public function getId();

    public function getSubject();

    public function getBody();

    public function getSender();

    public function getDate();

    public function getIsUnread();

}
