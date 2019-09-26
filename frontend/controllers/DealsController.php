<?php
namespace frontend\controllers;
use frontend\models\Company;
use frontend\models\Contact;
use frontend\models\Deal;
use yii\web\Controller;

class DealsController extends Controller
{

    public function actionIndex()
    {
        $contact_data = [
            'name' => 'Савченко Юлия',
            'phone' => '78551469725',
            'position' => 'Менеджер',
            'email' => 'yula@bk.ru'
        ];

        $contact = new Contact();
        $contact->attributes = $contact_data;
        $contact->save();

        $company = Company::findOne(1);

        // привязывает контакт к компании
        $contact->link('company', $company);
    }
}
