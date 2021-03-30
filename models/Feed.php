<?php

namespace app\models;

use app\behaviors\FeedBehavior;
use Yii;
use yii\behaviors\BlameableBehavior;
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
            [['type', 'value'], 'required'],
            [['dt_add', 'type', 'user_id', 'value', 'deal_id'], 'safe'],
            [['user_id'], 'integer'],
            [['type'], 'string', 'max' => 32],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class, 'targetAttribute' => ['user_id' => 'id']],
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
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getDeal()
    {
        return $this->hasOne(Deal::class, ['id' => 'deal_id']);
    }

    public function getAssociatedContent()
    {
        switch ($this->type) {
            case self::TYPE_NOTE:
                return Note::findOne($this->value);
            case self::TYPE_STATUS:
                return DealStatus::findOne($this->value);
        }

        return null;
    }
}
