<?php
namespace frontend\controllers;
use frontend\models\Contact;
use htmlacademy\utils\ContactsImporter;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        $contact = Contact::find()->one();

        if ($contact) {
            print($contact->name);
            print($contact->phone);
            print($contact->email);
            print($contact->position);
        }
    }
}
