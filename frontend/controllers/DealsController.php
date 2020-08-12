<?php

namespace frontend\controllers;

use frontend\models\Deal;
use frontend\models\DealStatus;

class DealsController extends TableController
{
    public function init()
    {
        $this->entity = new Deal;
        $this->alias = 'deals';
    }

    public function actionIndex()
    {
        $dealStatuses = DealStatus::find()->all();

        return $this->render('index', ['statuses' => $dealStatuses]);
    }

}
