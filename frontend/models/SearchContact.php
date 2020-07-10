<?php

namespace frontend\models;

use yii\data\ActiveDataProvider;

class SearchContact extends Contact
{
    public $search;

    public function search($params)
    {
        $query = self::find();
        $dataProvider = new ActiveDataProvider(['query' => $query]);

        if ($params) {
            $this->load($params);

            $query->andFilterWhere(['type_id' => $this->type_id]);
            $query->andFilterWhere(['company_id' => $this->company_id]);

            if ($this->search) {
                $query->orWhere(['like', 'email', $this->search]);
                $query->orWhere(['like', 'name', $this->search]);
                $query->orWhere(['like', 'phone', $this->search]);
            }
        }

        return $dataProvider;
    }
}
