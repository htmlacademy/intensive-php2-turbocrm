<?php
namespace frontend\controllers;
use yii\web\Controller;

class UserController extends Controller
{
    public function actionLogout() {
        \Yii::$app->user->logout();

        return $this->goHome();
    }
}
