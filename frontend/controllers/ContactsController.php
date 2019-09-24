<?php
namespace frontend\controllers;
use htmlacademy\utils\ContactsImporter;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        $contactsImporter = new ContactsImporter("/tmp/contacts.csv", ['name', 'phone']);

        \Yii::$app->db->open(); // проверка, что параметры подключения к БД установлены верно

        return $this->render('index');
    }
}
