<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "deal_status".
 *
 * @property int $id
 * @property string $name
 */
class DealStatus extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'deal_status';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name'], 'string', 'max' => 255],
            [['name'], 'unique'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
        ];
    }

    public function getNextStatus()
    {
        $next = self::find()->orderBy('id ASC')->where(['>', 'id', $this->id])->one();

        return $next;
    }

    public function getPrevStatus()
    {
        $prev = self::find()->orderBy('id DESC')->where(['<', 'id', $this->id])->one();

        return $prev;
    }

    public function getDeals()
    {
        return $this->hasMany(Deal::class,  ['status_id' => 'id'])->notDeleted();
    }

    public function getDealsAmount()
    {
        return $this->getDeals()->sum('budget_amount');
    }

    public function getDealsCount()
    {
        return $this->getDeals()->count();
    }

}
