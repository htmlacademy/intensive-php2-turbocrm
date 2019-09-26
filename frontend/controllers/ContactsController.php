<?php
namespace frontend\controllers;
use frontend\models\Company;
use frontend\models\Contact;
use Yii;
use yii\db\Query;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        $company = Company::findOne(1);
        $contacts = $company->activeContacts;

        foreach ($contacts as $contact) {
            echo $contact->name, $contact->phone, $contact->company->name;
        }
    }
}
