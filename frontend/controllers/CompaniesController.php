<?php


namespace frontend\controllers;


use frontend\models\Company;
use frontend\models\Contact;

class CompaniesController extends TableController
{
    public function init()
    {
        parent::init();

        $this->entity = new Company;
        $this->alias = 'companies';
    }
}
