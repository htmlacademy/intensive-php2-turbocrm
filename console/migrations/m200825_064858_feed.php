<?php

use yii\db\Expression;
use yii\db\Migration;

/**
 * Class m200825_064858_feed
 */
class m200825_064858_feed extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function up()
    {
        $this->createTable('feed', [
            'id' => $this->primaryKey()->notNull(),
            'type' => $this->char(32)->notNull(),
            'dt_add' => $this->dateTime()->defaultValue(new Expression('NOW()')),
            'user_id' => $this->integer()->notNull(),
            'deal_id' => $this->integer()->notNull(),
            'value' => $this->char(255)->notNull()
        ]);

        $this->addForeignKey('feed_user', 'feed', 'user_id', 'user', 'id');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m200825_064858_feed cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200825_064858_feed cannot be reverted.\n";

        return false;
    }
    */
}
