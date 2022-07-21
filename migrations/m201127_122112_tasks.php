<?php

use yii\db\Migration;

/**
 * Class m201127_122112_tasks
 */
class m201127_122112_tasks extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function up()
    {
        $this->createTable('task_types', [
            'id' => $this->primaryKey()->notNull(),
            'name' => $this->char(255)->unique()
        ]);

        $this->batchInsert('task_types', ['name'], [
            ['Разработка'], ['Маркетинг'], ['Дизайн'], ['Аналитика'], ['Копирайтинг'],
        ]);

        $this->createTable('task', [
            'id' => $this->primaryKey()->notNull(),
            'description' => $this->text()->notNull(),
            'executor_id' => $this->integer()->notNull(),
            'due_date' => $this->date(),
            'type_id' => $this->integer()->notNull(),
            'dt_add' => $this->dateTime()->defaultValue(new \yii\db\Expression('NOW()')),
            'deal_id' => $this->integer()->notNull()
        ]);

        $this->addForeignKey('task_type_id', 'task', 'type_id', 'task_types', 'id');
        $this->addForeignKey('task_deal_id', 'task', 'deal_id', 'deal', 'id');
        $this->addForeignKey('task_executor_id', 'task', 'executor_id', 'user', 'id');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m201127_122112_tasks cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m201127_122112_tasks cannot be reverted.\n";

        return false;
    }
    */
}
