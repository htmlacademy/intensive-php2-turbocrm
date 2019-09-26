<?php
namespace frontend\controllers;
use frontend\models\Company;
use frontend\models\Contact;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        $contact = Contact::findOne(['email' => 'den4ik@mail.ru']);

//         показывает название компании, к которой принадлежит контакт
        print($contact->company->name);

        $company = Company::findOne(1);
        $contacts = $company->contacts;

        // массив с объектами-клиентами этой компании
        var_dump($contacts);
    }
}
