<?php

namespace frontend\models;

use frontend\interfaces\PersonInterface;
use yii\db\ActiveRecord;
use yii2tech\ar\softdelete\SoftDeleteBehavior;
use yii2tech\ar\softdelete\SoftDeleteQueryBehavior;

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
 * @property string $dt_add
 *
 * @property DealStatus $status
 * @property Task[] $tasks
 */
class Deal extends ActiveRecord
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
            'dt_add' => 'Дата создания',
        ];
    }

    public function behaviors()
    {
        return [
            'softDeleteBahvior' => [
                'class' => SoftDeleteBehavior::class,
                'softDeleteAttributeValues' => ['deleted' => true]
            ]
        ];
    }

    public static function find()
    {
        $query = parent::find();
        $query->attachBehavior('softDelete', SoftDeleteQueryBehavior::class);

        return $query;
    }


    public function getFeedItems()
    {
        $firstItem = new Feed();
        $firstItem->setAttributes([
            'user_id' => $this->user_id,
            'type' => Feed::TYPE_NEW,
            'value' => $this->id,
            'deal_id' => $this->id,
            'dt_add' => $this->dt_add
        ]);

        return array_merge([$firstItem], $this->feed);
    }

    public function getOwner()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getExecutor()
    {
        return $this->hasOne(User::class, ['id' => 'executor_id']);
    }

    public function getCompany()
    {
        return $this->hasOne(Company::class, ['id' => 'company_id']);
    }

    public function getContact()
    {
        return $this->hasOne(Contact::class, ['id' => 'contact_id']);
    }

    public function getStatus()
    {
        return $this->hasOne(DealStatus::class, ['id' => 'status_id']);
    }

    public function getNotes()
    {
        return $this->hasMany(Note::class, ['deal_id' => 'id']);
    }

    public function getTasks()
    {
        return $this->hasMany(Task::class, ['deal_id' => 'id']);
    }

    public function getFeed()
    {
        return $this->hasMany(Feed::class, ['deal_id' => 'id'])->orderBy('dt_add ASC');
    }

    /**
     * @return PersonInterface[]
     */
    public function getAllParticipants()
    {
        $participants = [
            $this->contact, $this->executor, $this->owner
        ];

        return array_filter($participants);
    }
}
