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
            [['company_id'], 'required'],
            [['company_id', 'status_id', 'contact_id', 'executor_id', 'budget_amount'], 'integer'],
            [['due_date', 'dt_create'], 'safe'],
            [['description'], 'string'],
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
            'name' => 'Name',
            'company_id' => 'Company ID',
            'status_id' => 'Status ID',
            'contact_id' => 'Contact ID',
            'executor_id' => 'Executor ID',
            'due_date' => 'Due Date',
            'description' => 'Description',
            'budget_amount' => 'Budget Amount',
            'dt_create' => 'Dt Create',
        ];
    }

    public function getCompany()
    {
        return $this->hasOne(Company::class, ['id' => 'company_id']);
    }
}
