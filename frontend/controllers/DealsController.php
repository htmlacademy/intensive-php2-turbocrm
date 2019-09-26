<?php
namespace frontend\controllers;
use frontend\models\Deal;
use yii\web\Controller;

class DealsController extends Controller
{

    public function actionIndex()
    {
        $deal = Deal::findOne(1);

        $contacts = $deal->contacts;

        foreach ($contacts as $contact) {
            print($contact->name);
        }
    }

}
