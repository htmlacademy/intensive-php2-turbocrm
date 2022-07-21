<?php

namespace app\models;

use app\interfaces\PersonInterface;
use yii\data\ActiveDataProvider;
use yii\db\ActiveRecord;
use yii\db\Expression;

class Contact extends ActiveRecord implements PersonInterface
{
    use SoftDelete;

    public $onlyDeals;
    public $search;

    public function search($params)
    {
        $query = self::find();
        $dataProvider = new ActiveDataProvider(['query' => $query]);

        $this->load($params);

        $query->orFilterWhere(['like', 'name', $this->search]);
        $query->orFilterWhere(['like', 'phone', $this->search]);
        $query->orFilterWhere(['like', 'email', $this->search]);

        $query->filterWhere(['type_id' => $this->type_id, 'company_id' => $this->company_id]);

        if ($this->onlyDeals) {
            $query->joinWith('deals', true, 'right join');

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
            'onlyDeals' => 'Только со сделками'
        ];
    }

    public function rules()
    {
        return [
            [['name', 'phone', 'email', 'position', 'type_id', 'company_id', 'search', 'onlyDeals'], 'safe'],
            [['name', 'phone', 'email', 'position', 'type_id', 'company_id'], 'required', 'on' => 'insert'],
            [['name', 'email'], 'required', 'on' => 'update'],
            ['company_id', 'exist', 'targetRelation' => 'company'],
            ['type_id', 'exist', 'targetRelation' => 'status'],
            [['phone', 'email'], 'unique'],
            ['phone', 'string', 'length' => 11],
            ['email', 'email']
        ];
    }

    public function getDeals()
    {
        return $this->hasMany(Deal::class, ['contact_id' => 'id'])->inverseOf('contact');
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

    public function getPersonName()
    {
        return $this->name;
    }

    public function getPersonPosition()
    {
        return $this->position;
    }

    public function getPersonCompany()
    {
        return $this->company->name ?? null;
    }

}
