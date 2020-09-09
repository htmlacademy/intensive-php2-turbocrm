<?php

namespace frontend\controllers;

use frontend\models\Deal;
use frontend\models\DealStatus;
use frontend\models\Note;
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
        $deal = Deal::findOne($id);
        $note = new Note();

        if (!$deal) {
            throw new NotFoundHttpException("Сделка с этим ID не найдена");
        }

        if (\Yii::$app->request->isPost) {
            $note->load(\Yii::$app->request->post());
            $note->save();

            $deal->link('notes', $note);
            $note->content = null;
        }

        return $this->render('view', ['deal' => $deal, 'note' => $note]);
    }

    public function actionSave($id)
    {
        $deal = Deal::findOne($id);

        if ($deal) {
            $deal->load(\Yii::$app->request->post());
            $deal->save();
        }
    }

}
