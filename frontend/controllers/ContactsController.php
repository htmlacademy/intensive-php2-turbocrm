<?php
namespace frontend\controllers;
use frontend\models\Contact;
use htmlacademy\utils\ContactsImporter;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        $props = [
            'name' => 'Титов Денис',
            'email' => 'den4ik@mail.ru',
            'phone' => '78006994521',
            'position' => 'Бухгалтер'
        ];

        $contact = new Contact();
        $contact->attributes = $props;

        $contact->save();
    }
}
