<?php
namespace frontend\controllers;
use frontend\models\LoginForm;
use yii\filters\AccessControl;
use yii\web\Controller;

class LandingController extends Controller
{
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'denyCallback' => function($rule, $action) {
                    $this->redirect(['dashboard/index']);
                },
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => ['?']
                    ]
                ]
            ]
        ];
    }

    public function actionIndex()
    {
        $this->layout = 'anon';

        return $this->render('index');
    }
}
