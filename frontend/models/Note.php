<?php

namespace frontend\models;

use Yii;

/**
 * This is the model class for table "deal_notes".
 *
 * @property int $id
 * @property int $deal_id
 * @property string $dt_add
 * @property int $user_id
 * @property string $content
 *
 * @property Deal $deal
 * @property User $user
 */
class Note extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'note';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['deal_id', 'user_id'], 'required'],
            [['deal_id', 'user_id'], 'integer'],
            [['dt_add'], 'safe'],
            [['content'], 'string'],
            [['deal_id'], 'exist', 'skipOnError' => true, 'targetClass' => Deal::className(), 'targetAttribute' => ['deal_id' => 'id']],
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
            'deal_id' => 'Deal ID',
            'dt_add' => 'Dt Add',
            'user_id' => 'User ID',
            'content' => 'Content',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDeal()
    {
        return $this->hasOne(Deal::className(), ['id' => 'deal_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }
}
