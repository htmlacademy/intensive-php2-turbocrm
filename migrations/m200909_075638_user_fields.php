<?php

use yii\db\Migration;

/**
 * Class m200909_075638_user_fields
 */
class m200909_075638_user_fields extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('user', 'name', $this->char(255));
        $this->addColumn('user', 'position', $this->char(255));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m200909_075638_user_fields cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200909_075638_user_fields cannot be reverted.\n";

        return false;
    }
    */
}
