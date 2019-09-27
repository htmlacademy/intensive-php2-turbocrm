<?php
namespace frontend\controllers;
use frontend\models\Company;
use frontend\models\Contact;
use Yii;
use yii\db\Query;
use yii\web\Controller;
use yii\web\NotFoundHttpException;

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

    public function actionShow($id)
    {
        $contact = Contact::findOne($id);

        if (!$contact) {
            throw new NotFoundHttpException("Контакт с ID $id не найден");
        }

        return $this->render('view', ['contact' => $contact]);
    }

    public function actionFilter($status)
    {
        $contacts = Contact::findAll(['status' => $status]);

        return $this->render('index', ['contacts' => $contacts]);
    }
}
