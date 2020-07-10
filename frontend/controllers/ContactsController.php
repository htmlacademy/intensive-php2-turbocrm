<?php
namespace frontend\controllers;
use frontend\models\Contact;
use frontend\models\SearchContact;
use Yii;
use yii\web\NotFoundHttpException;
use yii\web\Response;
use yii\widgets\ActiveForm;

class ContactsController extends SecuredController
{
    public function behaviors()
    {
        $rules = parent::behaviors();
        $rule = [
            'allow' => false,
            'actions' => ['update'],
            'matchCallback' => function ($rule, $action) {
                $id = Yii::$app->request->get('id');
                $contact = Contact::findOne($id);

                return $contact->owner_id != Yii::$app->user->getId();
            }
        ];

        array_unshift($rules['access']['rules'], $rule);

        return $rules;
    }

    public function actionJson() {
        $contacts = Contact::find()->asArray()->all();

        $response = Yii::$app->response;
        $response->data = $contacts;
        $response->format = Response::FORMAT_JSON;

        return $response;
    }

    public function actionCreate()
    {
        $contact = new Contact();
        $contact->setScenario('insert');

        if (Yii::$app->request->isAjax && $contact->load(Yii::$app->request->post())) {
            Yii::$app->response->format = Response::FORMAT_JSON;
            return ActiveForm::validate($contact);
        }

        if (Yii::$app->request->isPost) {
            $contact->load(Yii::$app->request->post());

            if ($contact->save()) {
                Yii::$app->getSession()->setFlash('contact_create');

                return $this->redirect('/persons');
            }
        }
    }

    public function actionIndex()
    {
        $searchContact = new SearchContact();
        $dataProvider = $searchContact->search(Yii::$app->request->get());

        $dataProvider = Yii::configure($dataProvider, [
            'pagination' => ['pageSize' => 10],
            'sort' => ['defaultOrder' => ['id' => SORT_DESC]]
        ]);

        $dataProvider->getModels();

        return $this->render('index', ['dataProvider' => $dataProvider, 'searchModel' => $searchContact,
            'model' => new Contact]);
    }

    public function actionUpdate($id)
    {
        $contact = Contact::findOne($id);

        if (!$contact) {
            throw new NotFoundHttpException("Контакт с ID #$id не найден");
        }

        return $this->render('update', ['contact' => $contact]);
    }

    public function actionShow($id)
    {
        $contact = Contact::findOne($id);

        if (!$contact) {
            throw new NotFoundHttpException("Контакт с ID $id не найден");
        }

        return $this->render('view', ['contact' => $contact]);
    }

    public function actionFilter($status)
    {
        $contacts = Contact::findAll(['status' => $status]);

        return $this->render('index', ['contacts' => $contacts]);
    }
}
