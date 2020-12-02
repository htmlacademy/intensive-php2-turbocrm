<?php


namespace frontend\controllers;

use Yii;
use yii\db\ActiveRecord;
use yii\web\Response;
use yii\widgets\ActiveForm;

class EntityController extends SecuredController
{

    /**
     * @var ActiveRecord
     */
    protected $entity;
    protected $alias;

    protected $redirectAfterSaveUrl = null;

    public function actionCreate()
    {
        $model = $this->entity;
        $model->setScenario('insert');

        return $this->storeModel($model);
    }

    public function actionUpdate($id)
    {
        $model = $this->entity::findOne($id);

        if ($model) {
            $model->setScenario('update');

            return $this->storeModel($model);
        }
    }

    public function actionIndex($id = null)
    {
        $searchModel = $this->entity;
        $dataProvider = $searchModel->search(Yii::$app->request->get());

        $model = $this->entity;

        if ($id) {
            $model = $model::findOne($id) ?: $this->entity;
        }

        $dataProvider = Yii::configure($dataProvider, [
            'pagination' => ['pageSize' => 10],
            'sort' => ['defaultOrder' => ['id' => SORT_DESC]]
        ]);

        $dataProvider->getModels();

        return $this->render('index', ['dataProvider' => $dataProvider, 'model' => $model, 'searchModel' => $searchModel]);
    }

    public function actionDelete($id)
    {
        $model = $this->entity::findOne($id);

        if ($model) {
            $model->softDelete();

            return $this->redirect([$this->alias . '/index']);
        }
    }

    /**
     * @param ActiveRecord $model
     * @return array|Response
     */
    protected function storeModel(ActiveRecord $model)
    {
        if (Yii::$app->request->isAjax && $model->load(Yii::$app->request->post())) {
            Yii::$app->response->format = Response::FORMAT_JSON;
            return ActiveForm::validate($model);
        }

        if (Yii::$app->request->isPost) {
            $model->load(Yii::$app->request->post());

            if ($model->save()) {
                Yii::$app->getSession()->setFlash($this->alias . '_create');
                $redirectUrl = $this->redirectAfterSaveUrl ?: [$this->alias . '/index'];

                return $this->redirect($redirectUrl);
            }
        }
    }
}
