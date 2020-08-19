<?php

namespace frontend\controllers;

use frontend\models\Deal;
use frontend\models\DealStatus;
use yii\web\NotFoundHttpException;

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

    public function actionView($id)
    {
        $model = Deal::findOne($id);

        if (!$model) {
            throw new NotFoundHttpException("Сделка с этим ID не найдена");
        }

        return $this->render('view', ['model' => $model]);
    }

}
