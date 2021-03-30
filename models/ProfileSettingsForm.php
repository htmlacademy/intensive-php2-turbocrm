<?php


namespace app\models;


class ProfileSettingsForm extends User
{
    public $new_password;
    public $new_password_repeat;

    const SCENARIO_PROFILE = 'profile';

    public function rules()
    {
        $rules = parent::rules();
        $rules[] = ['new_password', 'compare'];
        $rules[] = [['name', 'company', 'phone'], 'required', 'on' => self::SCENARIO_PROFILE];

        return $rules;
    }

    public function scenarios()
    {
        $scenarios = parent::scenarios();
        $scenarios[self::SCENARIO_PROFILE] = ['new_password', 'new_password_repeat'];

        return $scenarios;
    }


    public function attributeLabels()
    {
        $labels = parent::attributeLabels();

        $labels['new_password'] = 'Новый пароль';
        $labels['new_password_repeat'] = 'Повтор нового пароля';

        return $labels;
    }

    public function beforeSave($insert)
    {
        if ($this->new_password) {
            $this->password = \Yii::$app->security->generatePasswordHash($this->new_password);
        }

        return true;
    }


}
