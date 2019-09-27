<?php
namespace frontend\models;
use yii\db\ActiveRecord;

class User extends ActiveRecord
{
    public function attributeLabels()
    {
        return [
            'email' => 'Электронная почта',
            'phone' => 'Номер телефона',
            'company' => 'Название компании',
            'password' => 'Пароль',
            'password_retype' => 'Повтор пароля',
        ];
    }

    public function rules()
    {
        return [
            [['company', 'phone', 'email', 'password', 'password_retype'], 'safe']
        ];
    }

}
