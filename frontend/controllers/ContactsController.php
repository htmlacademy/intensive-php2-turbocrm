<?php
namespace frontend\controllers;
use frontend\models\Contact;
use frontend\models\SearchContact;
use Yii;
use yii\web\NotFoundHttpException;
use yii\web\Response;
use yii\widgets\ActiveForm;

class ContactsController extends TableController
{
    public function behaviors()
    {
        $rules = parent::behaviors();
        $rule = [
            'allow' => false,
            'actions' => ['update'],
            'matchCallback' => function ($rule, $action) {
                $id = Yii::$app->request->get('id');
                $contact = Contact::findOne($id);

                return $contact->owner_id != Yii::$app->user->getId();
            }
        ];

        array_unshift($rules['access']['rules'], $rule);

        return $rules;
    }

    public function init()
    {
        $this->entity = new Contact;
        $this->alias = 'persons';
    }
}
