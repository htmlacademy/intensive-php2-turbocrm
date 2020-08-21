<?php

use yii\db\Expression;
use yii\db\Migration;

/**
 * Class m200821_144606_deal_notes
 */
class m200821_144606_deal_notes extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function up()
    {
        $this->createTable('deal_notes', [
            'id' => $this->primaryKey(),
            'deal_id' => $this->integer()->notNull(),
            'dt_add' => $this->dateTime()->defaultValue(new Expression('NOW()')),
            'user_id' => $this->integer()->notNull(),
            'content' => $this->text()
        ]);

        $this->addForeignKey('user_note', 'deal_notes', 'user_id', 'user', 'id');
        $this->addForeignKey('deal_note', 'deal_notes', 'deal_id', 'deal', 'id');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m200821_144606_deal_notes cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200821_144606_deal_notes cannot be reverted.\n";

        return false;
    }
    */
}
