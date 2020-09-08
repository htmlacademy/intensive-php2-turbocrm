<?php

namespace frontend\models;

use Yii;
use yii\behaviors\BlameableBehavior;

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

    public function behaviors()
    {
        return [
            'blameable' => [
                'class' => BlameableBehavior::class,
                'createdByAttribute' => 'user_id', 'updatedByAttribute' => null
            ]
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['content', 'deal_id'], 'required'],
            [['deal_id', 'user_id'], 'integer'],
            [['content'], 'safe'],
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
