<?php

use yii\db\Migration;

/**
 * Class m200825_072235_deal_owner
 */
class m200825_072235_deal_owner extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function up()
    {
        $this->addColumn('deal', 'user_id', 'integer');
        $this->addForeignKey('deal_owner', 'deal', 'user_id', 'user', 'id');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m200825_072235_deal_owner cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200825_072235_deal_owner cannot be reverted.\n";

        return false;
    }
    */
}
