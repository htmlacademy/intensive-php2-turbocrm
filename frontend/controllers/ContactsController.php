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
        $query->select(['c.name', 'c.phone', 'company.name as company'])->from('contact c')
            ->join('INNER JOIN', 'company', 'c.company_id = company.id')
            ->orderBy(['c.dt_add' => SORT_ASC]);

        // выполнить запрос и получить результат в виде двухмерного массива
        $rows = $query->all();

        foreach ($rows as $row) {
            echo $row['name'], $row['phone'], $row['company'];
        }
    }
}
