<?php
namespace frontend\controllers;
use frontend\models\Contact;
use htmlacademy\utils\ContactsImporter;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        $contact = Contact::findOne(['email' => 'den4ik@mail.ru']);

        if ($contact) {
            $contact->phone = "79058889421";
            $contact->save();
        }
    }
}
