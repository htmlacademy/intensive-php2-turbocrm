<?php

namespace frontend\models;

use yii\data\ActiveDataProvider;

class SearchContact extends Contact
{
    public function search($params)
    {
        $query = self::find();
        $dataProvider = new ActiveDataProvider(['query' => $query]);

        if ($params) {
            $this->load($params);

            $query->andFilterWhere(['email' => $this->email]);
            $query->andFilterWhere(['position' => $this->position]);
        }

        return $dataProvider;
    }
}
