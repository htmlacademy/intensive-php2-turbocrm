<?php


namespace app\controllers;


use app\models\ProfileSettingsForm;
use app\models\User;

class ProfileController extends SecuredController
{
    public function actionSettings()
    {
        $model = ProfileSettingsForm::findOne(\Yii::$app->user->getId());
        $model->scenario = ProfileSettingsForm::SCENARIO_PROFILE;

        if (\Yii::$app->request->isPost) {
            $model->load(\Yii::$app->request->post());

            if ($model->save()) {
                $this->goHome();
            }
        }

        return $this->render('settings', ['model' => $model]);
    }
}
