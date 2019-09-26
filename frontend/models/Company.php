<?php
namespace frontend\models;
use yii\db\ActiveRecord;

class Company extends ActiveRecord
{
    public function attributeLabels()
    {
        return [
            'name' => 'Имя',
            'address' => 'Адрес',
            'email' => 'Рабочий email',
            'phone' => 'Рабочий телефон',
            'url' => 'Сайт',
            'ogrn' => 'ОГРН'
        ];
    }
}
