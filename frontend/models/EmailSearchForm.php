<?php


namespace frontend\models;


use yii\base\Model;

class EmailSearchForm extends Model
{
    public $q = null;

    public function rules()
    {
        return [
            [['q'], 'filter', 'filter' => function($value) {
                $value = trim($value);
                $value = "in:inbox $value";

                return $value;
            }],
            [['q'], 'string', 'length' => [2, 128]]
        ];
    }


}
