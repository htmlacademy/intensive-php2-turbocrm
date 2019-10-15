<?php
namespace frontend\controllers;
use frontend\models\User;
use yii\web\Controller;

class UserController extends Controller
{
    public function actionLogout()
    {
        \Yii::$app->user->logout();

        return $this->goHome();
    }

    public function actionProfile()
    {
        if ($id = \Yii::$app->user->getId()) {
            $user = User::findOne($id);

            print($user->email);
        }
    }
}
