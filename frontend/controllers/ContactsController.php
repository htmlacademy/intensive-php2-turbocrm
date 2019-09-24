<?php
namespace frontend\controllers;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        return $this->render('index');
    }
}
