<?php
namespace frontend\controllers;
use frontend\models\User;
use Yii;
use yii\web\Controller;

class SignupController extends Controller
{
    public function actionIndex() {
        $this->layout = 'anon';

        $user = new User();

        if (Yii::$app->request->getIsPost()) {
            $user->load(Yii::$app->request->post());

            if ($user->validate()) {
                // выполнить сохранение формы в БД
            }
        }

        return $this->render('index', ['model' => $user]);
    }
}
