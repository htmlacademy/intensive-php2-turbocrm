<?php
namespace frontend\controllers;
use frontend\models\Contact;
use htmlacademy\utils\ContactsImporter;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        $contacts = Contact::findAll(['position' => 'Менеджер']);

        foreach ($contacts as $contact) {
            print($contact->name);
        }
    }
}
