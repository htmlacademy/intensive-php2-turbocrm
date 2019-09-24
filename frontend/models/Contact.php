<?php
namespace frontend\models;
use yii\base\Model;

class Contact extends Model
{
    public $name;
    public $phone;
    public $email;
    public $position;

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
