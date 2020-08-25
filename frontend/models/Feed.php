<?php

namespace frontend\models;

use Yii;

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
class Feed extends \yii\db\ActiveRecord
{
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
            [['dt_add'], 'safe'],
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
}
