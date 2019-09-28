<?php
namespace frontend\controllers;
use frontend\models\User;
use Yii;
use yii\web\Controller;

class SignupController extends Controller
{
    public function beforeAction($action)
    {
        $this->layout = 'anon';

        $this->enableCsrfValidation = false;
        return true;
    }

    public function actionIndex() {
        $this->enableCsrfValidation = false;
        $user = new User();

        if (Yii::$app->request->getIsPost()) {
            $user->load(Yii::$app->request->post());

            if (!$user->validate()) {
                $errors = $user->getErrors();
            }
        }

        return $this->render('index');
    }
}
