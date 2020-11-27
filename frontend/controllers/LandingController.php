<?php
namespace frontend\controllers;
use frontend\models\LoginForm;
use yii\web\Controller;

class LandingController extends Controller
{
    public function actionLogin()
    {
        $loginForm = new LoginForm();

        if (\Yii::$app->request->getIsPost()) {
            $loginForm->load(\Yii::$app->request->post());

            if ($loginForm->validate()) {
                $user = $loginForm->getUser();

                \Yii::$app->user->login($user);

                return $this->goHome();
            }
        }
    }

    public function actionIndex()
    {
        $this->layout = 'anon';

        return $this->render('index');
    }
}
