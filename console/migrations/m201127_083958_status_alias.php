<?php

use yii\db\Migration;

/**
 * Class m201127_083958_status_alias
 */
class m201127_083958_status_alias extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function up()
    {
        $this->addColumn('deal_status', 'alias', $this->string());

        $this->update('deal_status', ['alias' => 'new'], ['id' => 1]);
        $this->update('deal_status', ['alias' => 'presentation'], ['id' => 2]);
        $this->update('deal_status', ['alias' => 'in-work'], ['id' => 3]);
        $this->update('deal_status', ['alias' => 'completed'], ['id' => 4]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m201127_083958_status_alias cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m201127_083958_status_alias cannot be reverted.\n";

        return false;
    }
    */
}
