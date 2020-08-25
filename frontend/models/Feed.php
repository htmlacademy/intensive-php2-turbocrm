<?php

namespace frontend\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "feed".
 *
 * @property int $id
 * @property string $type
 * @property string $dt_add
 * @property int $user_id
 * @property string $value
 *
 * @property User $user
 */
class Feed extends ActiveRecord
{

    const TYPE_NEW = 'new';
    const TYPE_STATUS = 'status';
    const TYPE_NOTE = 'note';
    const TYPE_EXECUTOR = 'executor';


    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'feed';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['type', 'user_id', 'value'], 'required'],
            [['dt_add', 'type', 'user_id', 'value', 'deal_id'], 'safe'],
            [['user_id'], 'integer'],
            [['type'], 'string', 'max' => 32],
            [['value'], 'string', 'max' => 1],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'type' => 'Type',
            'dt_add' => 'Dt Add',
            'user_id' => 'User ID',
            'value' => 'Value',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    public function getDeal()
    {
        return $this->hasOne(Deal::class, ['id' => 'deal_id']);

    }
}
