<?php
namespace frontend\controllers;
use frontend\models\Contact;
use htmlacademy\utils\ContactsImporter;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        $contact = new Contact();
        $contact->name = "Петров Иван";
        $contact->phone = "79005552211";
        $contact->email = "petro.ivan@mail.ru";
        $contact->position = "Менеджер";

        // сохранение модели в базе данных
        $contact->save();

        return $this->render('index');
    }
}
