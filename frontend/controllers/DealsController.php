<?php

namespace frontend\controllers;

use frontend\models\DealStatus;

class DealsController extends \frontend\controllers\SecuredController
{
    public function actionIndex()
    {
        $dealStatuses = DealStatus::find()->all();

        return $this->render('index', ['statuses' => $dealStatuses]);
    }

}
