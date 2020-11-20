<?php

namespace common\services\containers;

interface MailMessage
{

    public function getSubject();

    public function getBody();

    public function getSender();

    public function hasAttach();

    public function getDate();

    public function isMarked();

    public function getSnippet();

}
