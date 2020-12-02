<?php
namespace frontend\controllers;
use frontend\models\Contact;
use Yii;

class ContactsController extends EntityController
{
    public function init()
    {
        parent::init();

        $this->entity = new Contact;
        $this->alias = 'contacts';
    }
}
