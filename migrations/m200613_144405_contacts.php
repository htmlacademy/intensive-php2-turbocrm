<?php

use yii\db\Migration;

/**
 * Class m200613_144405_contacts
 */
class m200613_144405_contacts extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function up()
    {
        $this->createTable('contact_types', [
            'id' => $this->primaryKey(),
            'name' => $this->char(255)->unique()
        ]);

        $this->addColumn('contact', 'type_id', $this->integer()->unsigned());
        $this->addColumn('contact', 'company_id', $this->integer()->unsigned());

        $this->batchInsert('contact_types', ['name'], [['Новый'], ['Активный'], ['Архив']]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m200613_144405_contacts cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200613_144405_contacts cannot be reverted.\n";

        return false;
    }
    */
}
