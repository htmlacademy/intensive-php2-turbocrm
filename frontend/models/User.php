<?php
namespace frontend\models;
use frontend\interfaces\PersonInterface;
use frontend\validators\RemoteEmailValidator;
use yii\web\IdentityInterface;

class User extends \common\models\User implements IdentityInterface, PersonInterface
{
    public $password_repeat;

    public static function findIdentity($id)
    {
        return self::findOne($id);
    }

    public function attributeLabels()
    {
        return [
            'email' => 'Электронная почта',
            'phone' => 'Номер телефона',
            'company' => 'Название компании',
            'password' => 'Пароль',
            'password_repeat' => 'Повтор пароля',
        ];
    }

    public function rules()
    {
        return [
            [['company', 'phone', 'email', 'password', 'password_repeat', 'name', 'position'], 'safe'],
            [['company', 'phone', 'email', 'password', 'password_repeat'], 'required', 'on' => self::SCENARIO_DEFAULT],
            ['email', 'email'],
            ['email', 'unique', 'on' => self::SCENARIO_DEFAULT],
            ['email', RemoteEmailValidator::class, 'on' => self::SCENARIO_DEFAULT],
            ['phone', 'match', 'pattern' => '/^[\d]{11}/i',
                'message' => 'Номер телефона должен состоять из 11 цифр'],
            ['company', 'string', 'min' => 3],
            ['password', 'string', 'min' => 8],
            ['password', 'compare', 'on' => self::SCENARIO_DEFAULT]
        ];
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
        return $this->company;
    }
}
