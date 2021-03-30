<?php


namespace app\controllers;


use app\models\Company;
use app\models\Contact;

class CompaniesController extends EntityController
{
    public function init()
    {
        parent::init();

        $this->entity = new Company;
        $this->alias = 'companies';
    }
}
