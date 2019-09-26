<?php
namespace frontend\models;

use yii\db\ActiveRecord;

class Deal extends ActiveRecord
{
    public function getContacts() {
        return $this->hasMany(Contact::class, ['id' => 'contact_id'])->viaTable('deal_contacts', ['deal_id' => 'id']);
    }
}
