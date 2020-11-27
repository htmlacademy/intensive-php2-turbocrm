<?php
namespace frontend\controllers;
use frontend\models\LoginForm;
use frontend\models\User;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use yii\widgets\ActiveForm;
use Yii;

class UserController extends Controller
{
    public $layout = 'anon';

    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'only' => ['index'],
                'rules' => [
                    [
                        'allow' => true,
                        'actions' => ['login', 'signup'],
                        'roles' => ['?']
                    ]
                ]
            ]
        ];
    }

    public function actionLogout()
    {
        \Yii::$app->user->logout();

        return $this->goHome();
    }

    public function actionSignup()
    {
        $user = new User();

        if (Yii::$app->request->getIsPost()) {
            $user->load(Yii::$app->request->post());

            if (Yii::$app->request->isAjax) {
                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($user);
            }

            if ($user->validate()) {
                $user->password = Yii::$app->security->generatePasswordHash($user->password);

                $user->save(false);
                $this->goHome();
            }
        }

        return $this->render('signup', ['model' => $user]);
    }

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

        return $this->redirect(['landing/index']);
    }
}
