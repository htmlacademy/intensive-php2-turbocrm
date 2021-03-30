<?php

use yii\db\Migration;

/**
 * Class m200729_174942_deals
 */
class m200729_174942_deals extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('deal', [
            'id' => $this->primaryKey(),
            'name' => $this->char(255),
            'company_id' => $this->integer()->unsigned()->notNull(),
            'status_id' => $this->integer()->unsigned(),
            'contact_id' => $this->integer()->unsigned(),
            'executor_id' => $this->integer()->unsigned(),
            'due_date' => $this->date(),
            'description' => $this->text(),
            'budget_amount' => $this->integer(),
            'dt_add' => $this->dateTime()->defaultValue(new \yii\db\Expression('NOW()'))
        ]);

        $this->createTable('deal_status', [
            'id' => $this->primaryKey(),
            'name' => $this->char(255)->unique()
        ]);

        $this->createTable('deal_tag', [
            'id' => $this->primaryKey(),
            'name' => $this->char(255),
            'deal_id' => $this->integer()->unsigned(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m200729_174942_deals cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200729_174942_deals cannot be reverted.\n";

        return false;
    }
    */
}
