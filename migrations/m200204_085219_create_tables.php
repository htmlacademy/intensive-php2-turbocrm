<?php

use yii\db\Migration;

/**
 * Class m200204_085219_create_tables
 */
class m200204_085219_create_tables extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('user', [
            'id' => $this->primaryKey()->notNull(),
            'email' => $this->char(128)->notNull()->unique(),
            'company' => $this->char(128),
            'phone' => $this->char(11)->notNull(),
            'password' => $this->char(64)->notNull()
        ]);

        $this->createTable('company', [
            'id' => $this->primaryKey()->notNull(),
            'email' => $this->char(128)->notNull(),
            'name' => $this->char(128),
            'url' => $this->char(128),
            'phone' => $this->char(11),
            'address' => $this->char(255),
            'dt_add' => $this->dateTime()->defaultValue(new \yii\db\Expression('NOW()'))
        ]);

        $this->createTable('contact', [
            'id' => $this->primaryKey()->notNull(),
            'email' => $this->char(128)->notNull(),
            'name' => $this->char(128),
            'position' => $this->char(128),
            'phone' => $this->char(11),
            'dt_add' => $this->dateTime()->defaultValue(new \yii\db\Expression('NOW()'))
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m200204_085219_create_tables cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m200204_085219_create_tables cannot be reverted.\n";

        return false;
    }
    */
}
