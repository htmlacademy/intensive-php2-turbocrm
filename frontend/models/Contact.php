<?php

namespace frontend\models;

use yii\data\ActiveDataProvider;
use yii\db\ActiveRecord;

class Contact extends ActiveRecord
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

    public static function tableName()
    {
        return "contact";
    }

    public function attributeLabels()
    {
        return [
            'name' => 'Имя',
            'phone' => 'Телефон',
            'email' => 'Электронная почта',
            'position' => 'Должность',
            'dt_add' => 'Дата добавления',
            'company_id' => 'Компания',
            'type_id' => 'Тип',
        ];
    }

    public function rules()
    {
        return [
            [['name', 'phone', 'email', 'position', 'type_id', 'company_id', 'search'], 'safe'],
            [['name', 'phone', 'email', 'position', 'type_id', 'company_id'], 'required', 'on' => 'insert'],
            ['company_id', 'exist', 'targetRelation' => 'company'],
            ['type_id', 'exist', 'targetRelation' => 'status'],
            [['phone', 'email'], 'unique'],
            ['phone', 'string', 'length' => 11],
            ['email', 'email']
        ];
    }

    public function getCompany()
    {
        return $this->hasOne(Company::class, ['id' => 'company_id']);
    }

    public function getStatus()
    {
        return $this->hasOne(ContactType::class, ['id' => 'type_id']);
    }

    public static function getItemsCountByStatus($status)
    {
        return self::find()->joinWith('status s')->where(['s.name' => $status])->count();
    }
}
