<?php
namespace frontend\models;

use yii\db\ActiveRecord;

class Contact extends ActiveRecord
{
    public function attributeLabels()
    {
        return [
            'name' => 'Имя',
            'phone' => 'Телефон',
            'email' => 'Электронная почта',
            'position' => 'Должность'
        ];
    }

    public function rules()
    {
        return [
            [['name', 'phone', 'email', 'position'], 'safe']
        ];
    }

    public function getCompany() {
        return $this->hasOne(Company::class, ['id' => 'company_id']);
    }
}
