<?php

namespace frontend\models;

use Yii;

/**
 * This is the model class for table "deal".
 *
 * @property int $id
 * @property string $name
 * @property int $company_id
 * @property int $status_id
 * @property int $contact_id
 * @property int $executor_id
 * @property int $user_id
 * @property string $due_date
 * @property string $description
 * @property int $budget_amount
 * @property string $dt_create
 */
class Deal extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'deal';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['company_id', 'status_id', 'contact_id', 'executor_id', 'budget_amount', 'name', 'description'], 'required', 'on' => 'insert'],
            [['company_id', 'status_id', 'contact_id', 'executor_id', 'budget_amount', 'name', 'description'], 'safe'],
            [['company_id', 'status_id', 'contact_id', 'executor_id', 'budget_amount'], 'integer'],
            [['description', 'name'], 'string'],
            [['name'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Название',
            'company_id' => 'Компания',
            'status_id' => 'Этап',
            'user_id' => 'Создатель',
            'contact_id' => 'Контакт',
            'executor_id' => 'Исполнитель',
            'due_date' => 'Дата исполнения',
            'description' => 'Описание',
            'budget_amount' => 'Стоимость работ',
            'dt_create' => 'Дата создания',
        ];
    }

    public function getFeedItems()
    {
        $firstItem = new Feed();
        $firstItem->setAttributes([
            'user_id' => $this->user_id,
            'type' => Feed::TYPE_NEW,
            'value' => $this->id,
            'deal_id' => $this->id
        ]);

        return [$firstItem];
    }

    public function getOwner()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getCompany()
    {
        return $this->hasOne(Company::class, ['id' => 'company_id']);
    }

    public function getStatus()
    {
        return $this->hasOne(DealStatus::class, ['id' => 'status_id']);
    }

    public function getFeed()
    {
        return $this->hasMany(Feed::class, ['deal_id' => 'id']);
    }
}
