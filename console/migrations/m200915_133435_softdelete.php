<?php

use yii\db\Migration;

/**
 * Class m200915_133435_softdelete
 */
class m200915_133435_softdelete extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('user', 'deleted', $this->boolean()->defaultValue(0));
        $this->addColumn('company', 'deleted', $this->boolean()->defaultValue(0));
        $this->addColumn('deal', 'deleted', $this->boolean()->defaultValue(0));
        $this->addColumn('note', 'deleted', $this->boolean()->defaultValue(0));
        $this->addColumn('contact', 'deleted', $this->boolean()->defaultValue(0));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m200915_133435_softdelete cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200915_133435_softdelete cannot be reverted.\n";

        return false;
    }
    */
}
