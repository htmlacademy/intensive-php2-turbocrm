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

    public function getContacts() {
        return $this->hasMany(Contact::class, ['company_id' => 'id'])->inverseOf('company');
    }

    public function getActiveContacts() {
        return $this->getContacts()->where(['status' => '1'])->orderBy(['dt_add' => SORT_ASC]);
    }
}
