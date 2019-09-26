<?php
namespace frontend\controllers;
use frontend\models\Company;
use frontend\models\Contact;
use yii\db\Query;
use yii\web\Controller;

class ContactsController extends Controller
{
    public function actionIndex()
    {
        $query = new Query();
        $query->select(['id', 'name', 'phone'])->from('contact')->where(['position' => 'Менеджер'])->limit(10);

        // выполнить запрос и получить результат в виде двухмерного массива
        $rows = $query->all();

        foreach ($rows as $row) {
            print($row['name']);
        }
    }
}
