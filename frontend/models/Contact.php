<?php
namespace frontend\models;

use yii\db\ActiveRecord;

class Contact extends ActiveRecord
{
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
