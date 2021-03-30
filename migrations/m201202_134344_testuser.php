<?php

use yii\db\Migration;

/**
 * Class m201202_134344_testuser
 */
class m201202_134344_testuser extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->insert('user', [
            'email' => 'demo@demo.ru', 'password' => Yii::$app->security->generatePasswordHash('demo'),
            'company' => 'htmlacademy', 'name' => 'Тестовый пользователь', 'position' => 'Администратор',
            'phone' => '84796102359'
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m201202_134344_testuser cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m201202_134344_testuser cannot be reverted.\n";

        return false;
    }
    */
}
