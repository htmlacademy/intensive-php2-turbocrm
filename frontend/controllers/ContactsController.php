<?php
namespace frontend\controllers;
use common\services\GmailClient;
use common\services\GoogleAuthClientFactory;
use frontend\models\Contact;
use Yii;

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
        parent::init();

        $this->entity = new Contact;
        $this->alias = 'persons';
    }
}
