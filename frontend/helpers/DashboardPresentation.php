<?php

namespace frontend\helpers;

use frontend\models\Company;
use frontend\models\Contact;
use frontend\models\Deal;
use frontend\models\DealStatus;
use frontend\models\Task;
use frontend\models\User;
use yii\helpers\ArrayHelper;

class DashboardPresentation
{

    public function getHotTasks($limit = 5)
    {
        $query = Task::find();
        $query->orderBy('due_date ASC')->limit($limit);

        return $query->all();
    }

    public function getNewestCompanies($limit = 2)
    {
        $query = Company::find();
        $query->orderBy('dt_add DESC')->limit($limit);

        return $query->all();
    }

    public function getFinanceOverview()
    {
        $query = Deal::find();

        $forecast_amount = $query->where(['deleted' => 0])->sum('budget_amount');
        $current_amount  = $query->where(['deleted' => 0, 'status_id' => 4])->sum('budget_amount');

        return [$forecast_amount, $current_amount];
    }

    public function getDealsCounters()
    {
        $counters = [];

        foreach (DealStatus::find()->all() as $status) {
            $counters[$status->name] = $status->dealsCount;
        }

        return $counters;
    }

    public function getCommonCounters()
    {
        $tasks = Task::find()->count();
        $users = User::find()->count();

        $companies = Company::find()->count();
        $contacts = Contact::find()->count();

        $complete_deals = Deal::find()->where(['status_id' => 4])->count();

        return compact(['tasks', 'users', 'companies', 'contacts', 'complete_deals']);
    }

    public function getWeekPerformance()
    {
        $sql = 'SELECT WEEKDAY(dt_add) wday, COUNT(id) cnt FROM feed WHERE dt_add >= DATE_SUB(NOW(), INTERVAL 1 WEEK) GROUP BY wday';

        $rows = \Yii::$app->db->createCommand($sql)->queryAll();
        $rows = ArrayHelper::map($rows, 'wday', 'cnt');

        $wdays = array_fill(0, 7, 0);
        $result = array_replace($wdays, $rows);

        return $result;

    }

}
