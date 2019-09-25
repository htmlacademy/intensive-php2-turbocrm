<?php
namespace frontend\models;

use yii\db\ActiveRecord;

class Contact extends ActiveRecord
{
//    public $name;
//    public $phone;
//    public $email;
//    public $position;

    public function attributeLabels()
    {
        return [
            'name' => 'Имя',
            'phone' => 'Телефон',
            'email' => 'Электронная почта',
            'position' => 'Должность'
        ];
    }
}
