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
        $company = Company::find()->where(1)->joinWith('contacts')->one();
        $contacts = $company->contacts;

        foreach ($contacts as $contact) {
            echo $contact->name, $contact->phone, $contact->company->name;
        }
    }
}
